// src/components/SeatMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { SeatStatus } from "../enums.ts"; // Предположим, что путь корректен

interface SeatMapProps {
    wsUrl: string;
    channelName: string; // Это имя события Socket.IO, на которое будет подписываться клиент (например, 'seat_events')
    eventId: number;
    venueId: number;
}

// !!! ИСПРАВЛЕННЫЙ ИНТЕРФЕЙС RedisMessage: используем 'channel' вместо 'channelName'
interface RedisMessage {
    channel: string; // Реальное имя канала из Redis (например, 'seat:events:1_1')
    message: string; // Строка JSON, например, "[1,\"A\",\"5\"]"
    pattern: string; // Паттерн Redis, по которому было получено сообщение ('seat:events:*_*')
}

interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    lockedByGuestId?: string; // Опционально, если бэкенд будет присылать Guest ID
}

interface SeatApiResponse {
    data: Seat[];
    metadata: {
        requestId: string;
    };
}

interface UserSeatReservation {
    eventId: number;
    venueId: number;
    rowNumber: string;
    seatNumber: string;
}

const LOCAL_STORAGE_GUEST_ID_KEY = 'guestId';
const LOCAL_STORAGE_USER_LOCKS_KEY = 'userSeatLocks';

// Функция для генерации уникального Guest ID
const generateGuestId = (): string => {
    return 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const SeatMap: React.FC<SeatMapProps> = ({ wsUrl, channelName, eventId, venueId }) => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetched = useRef(false);
// --- Новое состояние для Guest ID и пользовательских резерваций ---
    const [guestId, setGuestId] = useState<string>('');
    // userLockedSeats хранит список мест, зарезервированных *этим* пользователем (по его Guest ID)
    const [userLockedSeats, setUserLockedSeats] = useState<UserSeatReservation[]>([]);
    // ------------------------------------------------------------------

    const fetchSeats = useCallback(async () => {
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
    }, [eventId, venueId]); // Зависимости для useCallback

    const handleWebSocketMessage = useCallback((data: RedisMessage) => {
        // !!! ИСПРАВЛЕНО: используем data.channel вместо data.channelName
        console.log(`[SeatMap] Received message from channel "${data.channel}" with pattern "${data.pattern}":`, data);
        try {
            const channelParts = data.channel.split(':'); // !!! ИСПРАВЛЕНО: data.channel

            // Проверяем, что паттерн совпадает и канал имеет достаточно частей для парсинга eventId_venueId
            // Ожидаемый формат канала: 'seat:events:EVENTID_VENUEID' (минимум 3 части)
            if (data.pattern === 'seat:events:*_*' && channelParts.length >= 3) {
                const eventVenuePart = channelParts[2]; // '1_1'
                const channelSubParts: string[] = eventVenuePart.split('_'); // ['1', '1']

                if (channelSubParts.length < 2 || isNaN(Number(channelSubParts[0])) || isNaN(Number(channelSubParts[1]))) {
                    console.warn(`[SeatMap] Invalid eventId_venueId format in channel: ${data.channel}. Expected 'eventId_venueId'.`);
                    return;
                }

                const receivedEventId = Number(channelSubParts[0]);
                const receivedVenueId = Number(channelSubParts[1]);

                // Фильтруем сообщения, чтобы обрабатывать только те, что относятся к текущему eventId и venueId
                if (!(receivedEventId === eventId && receivedVenueId === venueId)) {
                    console.log(`[SeatMap] Ignoring message. Expected eventId: ${eventId}, venueId: ${venueId}. Received eventId: ${receivedEventId}, venueId: ${receivedVenueId}.`);
                    return;
                }
            } else {
                console.log(`[SeatMap] Ignoring message. Pattern "${data.pattern}" does not match "seat:events:*_*" or invalid channel format.`);
                return; // Добавляем return, чтобы не пытаться парсить сообщение, которое не соответствует
            }

            // Парсинг сообщения: [SeatStatus, rowNumber, seatNumber]
            const messagePayload: [SeatStatus, string, string] = JSON.parse(data.message);

            const newStatusId = messagePayload[0];
            const rowNumber = messagePayload[1];
            const seatNumber = messagePayload[2];

            console.log(`[SeatMap] Parsed payload: newStatusId: ${newStatusId}, rowNumber: ${rowNumber}, seatNumber ${seatNumber}.`);

            setSeats(prevSeats =>
                prevSeats.map(seat => {
                    if (seat.rowNumber === rowNumber && seat.seatNumber === seatNumber) {
                        return { ...seat, statusId: newStatusId };
                    }
                    return seat;
                })
            );
        } catch (e) {
            console.error('[SeatMap] Error parsing WebSocket message or updating seat:', e);
        }
    }, [eventId, venueId]);

    const { isConnected, socket } = useWebSocket(wsUrl, channelName, handleWebSocketMessage);

    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetchSeats();
        }
    }, [fetchSeats]);

    const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
        if (!acc[seat.rowNumber]) {
            acc[seat.rowNumber] = [];
        }
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    const handleSeatClick = async (seat: Seat) => {
        if (!isConnected || seat.statusId === SeatStatus.BOOKED) return;

        const method = seat.statusId === SeatStatus.LOCKED ? 'DELETE' : 'POST';

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
                                        seat.statusId === SeatStatus.AVAILABLE ? 'btn-success' :
                                            seat.statusId === SeatStatus.LOCKED ? 'btn-warning' :
                                                'btn-danger'
                                    }`}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={areAllSeatsDisabled || seat.statusId === SeatStatus.BOOKED}
                                    title={`Seat ${seat.rowNumber}${seat.seatNumber} - Status: ${seat.statusId === SeatStatus.AVAILABLE ? 'Available' : seat.statusId === SeatStatus.LOCKED ? 'Locked' : 'Booked'}${areAllSeatsDisabled ? ' (No WS connection)' : ''}`}
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