// src/components/SeatMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '../../../shared/hooks/useWebSocket.ts';
import { SeatStatus } from '../types';
import { Seat } from './types.ts';

let counter:number=0;

interface SeatMapProps {
    eventId: number;
    venueId: number;
}

interface RedisMessage {
    channel: string;
    message: string;
    pattern: string;
}

interface SeatApiResponse {
    data: Seat[];
    metadata: {
        requestId: string;
    };
}

const SeatMap: React.FC<SeatMapProps> = ({ eventId, venueId }) => {
    const { showPopup } = usePopup();
    const { config, loading: configLoading } = useConfig();

    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetched = useRef(false);

    // Provide defaults for use in hook calls
    const guestId = config?.guestId ?? '';
    const seatMap = config?.seatMap ?? { apiUrl: '', wsUrl: '', wsSeatsEventsChannel: '' };
    const { apiUrl, wsUrl, wsSeatsEventsChannel } = seatMap;

    const fetchSeats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiUrl}/seats/${eventId}/${venueId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const json: SeatApiResponse = await res.json();
            console.log(`[fetchSeats] OK from: ${apiUrl}/seats/${eventId}/${venueId}`);
            setSeats(json.data);
        } catch (err) {
            console.error('Error fetching seats:', err);
            showPopup('Failed to load seats data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [eventId, venueId, apiUrl]);

    const handleWebSocketMessage = useCallback((data: RedisMessage) => {
        console.log(`[SeatMap] Received message from channel "${data.channel}" with pattern "${data.pattern}":`, data);

        try {
            const channelParts = data.channel.split(':');
            if (data.pattern === 'seat:events:*_*' && channelParts.length >= 3) {
                const [receivedEventId, receivedVenueId] = channelParts[2].split('_').map(Number);

                if (receivedEventId !== eventId || receivedVenueId !== venueId) {
                    console.log(`[SeatMap] Ignoring message. Expected eventId: ${eventId}, venueId: ${venueId}. Received: ${receivedEventId}_${receivedVenueId}.`);
                    return;
                }

                const messagePayload: [SeatStatus, string, string, string] = JSON.parse(data.message);
                const seatUpdate: Seat = {
                    statusId: messagePayload[0],
                    rowNumber: messagePayload[1],
                    seatNumber: messagePayload[2],
                    lockerId: messagePayload[3],
                };

                console.log(`[SeatMap] Parsed payload:`, seatUpdate);

                setSeats(prevSeats =>
                    prevSeats.map(seat =>
                        seat.rowNumber === seatUpdate.rowNumber && seat.seatNumber === seatUpdate.seatNumber
                            ? { ...seatUpdate }
                            : seat
                    )
                );
            } else {
                console.log(`[SeatMap] Ignoring message with pattern "${data.pattern}" or invalid channel format.`);
            }
        } catch (e) {
            console.error('[SeatMap] Error parsing WebSocket message or updating seat:', e);
        }
    }, [eventId, venueId]);

    const { isConnected } = useWebSocket(wsUrl, wsSeatsEventsChannel, handleWebSocketMessage, fetched);

    useEffect(() => {
        if (!fetched.current && config) {
            fetched.current = true;
            fetchSeats();
        }
    }, [fetchSeats, config]);

    if (configLoading) {
        return <div className="text-center mt-4">Loading configuration...</div>;
    }

    if (!config) {
        return <div className="alert alert-danger mt-4 text-center">Failed to load configuration.</div>;
    }

    if (loading) {
        return <div className="text-center mt-4">Loading seats...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4 text-center">Error: {error}</div>;
    }

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
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId,
                venueId,
                rowNumber: seat.rowNumber,
                seatNumber: seat.seatNumber,
                lockerId: guestId,
            }),
        };

        try {
            const response = await fetch(`${apiUrl}/seats/locks`, fetchConfig);

            if (!response.ok) {
                const errorData = await response.json();
                showPopup(`Failed to change seat status: ${errorData.message || 'Unknown error'}`, 'error');
            } else {
                console.log(`Seat ${seat.rowNumber}${seat.seatNumber} status change request sent.`);
            }
        } catch (err) {
            console.error('Error sending seat status change request:', err);
            showPopup('An unexpected error occurred while trying to change seat status.', 'error');
        }
    };

    const areAllSeatsDisabled = !isConnected;

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Seat Map for Event ID: {eventId}, Venue ID: {venueId}</h4>
            <p className="mb-3">
                WebSocket Status: <span className={isConnected ? 'text-success' : 'text-danger'}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
                {!isConnected && <span className="text-muted ms-2">(Interactions disabled)</span>}
            </p>
            {counter++}
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
                                        seat.lockerId === guestId ? 'btn-primary' :
                                            seat.statusId === SeatStatus.AVAILABLE ? 'btn-success' :
                                                seat.statusId === SeatStatus.LOCKED ? 'btn-warning' :
                                                    'btn-danger'
                                    }`}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={
                                        areAllSeatsDisabled ||
                                        seat.statusId === SeatStatus.BOOKED ||
                                        (seat.statusId === SeatStatus.LOCKED && seat.lockerId !== guestId)
                                    }
                                    title={`Seat ${seat.rowNumber}${seat.seatNumber} - Status: ${
                                        seat.statusId === SeatStatus.AVAILABLE ? 'Available' :
                                            seat.statusId === SeatStatus.LOCKED ? 'Locked' : 'Booked'
                                    }${areAllSeatsDisabled ? ' (No WS connection)' : ''}`}
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
