import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SeatMapProps {
    wsUrl: string;
    channelName: string; // Это имя события Socket.IO, на которое будет подписываться клиент
    eventId: number;
    venueId: number;
}

interface RedisMessage {
    pattern: string;
    channel: string; // Реальное имя канала из Redis (например, 'seats:A5:event:booked')
    message: string; // Строка JSON с обновленными данными о месте
}

interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: number; // 1 = available, 2 = locked, 3 = booked.
}

interface SeatApiResponse {
    data: Seat[];
    metadata: {
        requestId: string;
    };
}

const SeatMap: React.FC<SeatMapProps> = ({ wsUrl, channelName, eventId, venueId }) => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetched = useRef(false);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null);

    const fetchSeats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8081/seats/${eventId}/${venueId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const json: SeatApiResponse = await res.json();
            setSeats(json.data);
        } catch (err) {
            console.error('Error fetching seats:', err);
            setError('Failed to load seats data.');
        } finally {
            setLoading(false);
        }
    };

    const handleWebSocketMessage = useCallback((data: RedisMessage) => {
        console.log(`Received message from channel "${channelName}":`, data);
        try {
            // 1. Проверка канала Redis
            // Канал должен соответствовать паттерну "seats:lock:event:{eventId}" или "seats:unlock:event:{eventId}"
            const channelParts = data.channel.split(':'); // Разделяем канал по двоеточию
            const eventType = channelParts[1]; // 'lock' или 'unlock'
            const channelEventId = parseInt(channelParts[3]); // {eventId} из канала

            // Проверяем, что сообщение относится к текущему eventId
            if (channelEventId !== eventId) {
                console.log(`Ignoring message for eventId ${channelEventId}, expecting ${eventId}`);
                return; // Игнорируем сообщение, если eventId не совпадает
            }

            // Проверяем, что тип события - lock или unlock
            if (eventType !== 'lock' && eventType !== 'unlock') {
                console.log(`Ignoring message with unknown eventType: ${eventType}`);
                return;
            }

            // 2. Парсинг сообщения: это массив [venueId, rowNumber, seatNumber]
            const messagePayload: [number, string, string] = JSON.parse(data.message);

            const receivedVenueId = messagePayload[0];
            const rowNumber = messagePayload[1];
            const seatNumber = messagePayload[2];

            // Проверяем, что сообщение относится к текущему venueId
            if (receivedVenueId !== venueId) {
                console.log(`Ignoring message for venueId ${receivedVenueId}, expecting ${venueId}`);
                return;
            }

            // Определяем новый statusId на основе типа события
            const newStatusId = eventType === 'lock' ? 2 : 1; // 2 для locked, 1 для unlocked

            // 3. Обновление состояния мест
            setSeats(prevSeats =>
                prevSeats.map(seat => {
                    if (seat.rowNumber === rowNumber && seat.seatNumber === seatNumber) {
                        return { ...seat, statusId: newStatusId };
                    }
                    return seat;
                })
            );
        } catch (e) {
            console.error('Error parsing WebSocket message or updating seat:', e);
            // Можно добавить сообщение об ошибке в UI, если нужно
        }
    }, [channelName, eventId, venueId]); // Добавляем eventId и venueId в зависимости


    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetchSeats();
        }

        console.log(`Attempting to connect to WebSocket at ${wsUrl}`);
        const newSocket: Socket = io(wsUrl);
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server!');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server.');
            setIsConnected(false);
        });

        newSocket.on(channelName, handleWebSocketMessage);

        newSocket.on('connect_error', (error: Error) => {
            console.error('WebSocket connection error:', error.message);
            setIsConnected(false);
        });

        return () => {
            console.log('Disconnecting from WebSocket server...');
            newSocket.off(channelName, handleWebSocketMessage);
            newSocket.disconnect();
        };
    }, [wsUrl, channelName, handleWebSocketMessage]);

    const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
        if (!acc[seat.rowNumber]) {
            acc[seat.rowNumber] = [];
        }
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    const handleSeatClick = async (seat: Seat) => {
        // Мы уже будем отключать кнопки, если нет соединения,
        // но эта проверка добавит дополнительную гарантию.
        if (!isConnected || seat.statusId === 3) return;

        const method = seat.statusId === 2 ? 'DELETE' : 'POST';

        const fetchConfig: RequestInit = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: eventId,
                venueId: venueId,
                rowNumber: seat.rowNumber,
                seatNumber: seat.seatNumber,
            }),
        };

        try {
            const response = await fetch('http://localhost:8081/seats/locks', fetchConfig);

            if (response.ok) {
                console.log(`Request to change status for seat ${seat.rowNumber}${seat.seatNumber} sent. Awaiting WebSocket update.`);
            } else {
                const errorData = await response.json();
                alert(`Failed to change seat status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error sending seat status change request:', err);
            alert('An unexpected error occurred while trying to change seat status.');
        }
    };

    if (loading) {
        return <div className="text-center mt-4">Loading seats...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">Error: {error}</div>;
    }

    // Определяем, должны ли все кнопки быть отключены
    const areAllSeatsDisabled = !isConnected;

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Seat Map for Event ID: {eventId}, Venue ID: {venueId}</h4>
            <p className="mb-3">
                WebSocket Status: <span className={isConnected ? 'text-success' : 'text-danger'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
                {!isConnected && <span className="text-muted ms-2">(Interactions disabled)</span>}
            </p>

            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="mb-4">
                    <h5>Row {row}</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {rowSeats
                            .sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber))
                            .map(seat => (
                                <button
                                    key={`${seat.rowNumber}-${seat.seatNumber}`}
                                    className={`btn ${
                                        seat.statusId === 1 ? 'btn-success' :
                                            seat.statusId === 2 ? 'btn-warning' :
                                                'btn-danger'
                                    }`}
                                    onClick={() => handleSeatClick(seat)}
                                    // Кнопка отключена, если:
                                    // 1. Нет соединения с WebSocket (areAllSeatsDisabled)
                                    // 2. Место забронировано (seat.statusId === 3)
                                    disabled={areAllSeatsDisabled || seat.statusId === 3}
                                    title={`Seat ${seat.rowNumber}${seat.seatNumber} - Status: ${seat.statusId === 1 ? 'Available' : seat.statusId === 2 ? 'Locked' : 'Booked'}${areAllSeatsDisabled ? ' (No WS connection)' : ''}`}
                                >
                                    {seat.seatNumber}
                                </button>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SeatMap;