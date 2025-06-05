// src/components/SeatMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket.ts';
import { SeatStatus } from "../../enums.ts";
import {useGuestId} from "../../hooks/useGuestId.ts";
import {Seat} from "./types.ts";
import {useConfig} from "../../contexts/ConfigContext.tsx";

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

    const { config, loading: configLoading } = useConfig();
    if (configLoading) {
        return <div className="text-center mt-4">Loading configuration...</div>;
    }
    if (!config) {
        return <div className="alert alert-danger mt-4 text-center">Failed to load configuration.</div>;
    }

    const {
        apiUrl,
        wsUrl,
        wsSeatsEventsChannel
    } = config;

    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetched = useRef(false);

    const guestId = useGuestId();

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
            setError('Failed to load seats data.');
        } finally {
            setLoading(false);
        }
    }, [eventId, venueId]);

    const handleWebSocketMessage = useCallback((data: RedisMessage) => {

        // Received message from Redis: Pattern 'seat:events:*_*', Channel 'seat:events:1_1', Message: '[2,"A","2","abc"]'

        console.log(`[SeatMap] Received message from channel "${data.channel}" with pattern "${data.pattern}":`, data);
        try {
            const channelParts = data.channel.split(':');

            if (data.pattern === 'seat:events:*_*' && channelParts.length >= 3) {
                const eventVenuePart = channelParts[2]; // '1_1'
                const channelSubParts: string[] = eventVenuePart.split('_'); // ['1', '1']

                if (channelSubParts.length < 2 || isNaN(Number(channelSubParts[0])) || isNaN(Number(channelSubParts[1]))) {
                    console.warn(`[SeatMap] Invalid eventId_venueId format in channel: ${data.channel}. Expected 'eventId_venueId'.`);
                    return;
                }

                const receivedEventId = Number(channelSubParts[0]);
                const receivedVenueId = Number(channelSubParts[1]);

                if (!(receivedEventId === eventId && receivedVenueId === venueId)) {
                    console.log(`[SeatMap] Ignoring message. Expected eventId: ${eventId}, venueId: ${venueId}. Received eventId: ${receivedEventId}, venueId: ${receivedVenueId}.`);
                    return;
                }
            } else {
                console.log(`[SeatMap] Ignoring message. Pattern "${data.pattern}" does not match "seat:events:*_*" or invalid channel format.`);
                return;
            }

            const messagePayload: [SeatStatus, string, string, string] = JSON.parse(data.message);

            const seatUpdate:Seat = {
                statusId:messagePayload[0],
                rowNumber:messagePayload[1],
                seatNumber:messagePayload[2],
                lockerId:messagePayload[3],
            };

            console.log(`[SeatMap] Parsed payload: ${seatUpdate}.`);

            setSeats(prevSeats =>
                prevSeats.map(seat => {
                    if (seat.rowNumber === seatUpdate.rowNumber && seat.seatNumber === seatUpdate.seatNumber) {
                        return { ...seatUpdate };
                    }
                    return seat;
                })
            );
        } catch (e) {
            console.error('[SeatMap] Error parsing WebSocket message or updating seat:', e);
        }
    }, [eventId, venueId]);

    const { isConnected } = useWebSocket(wsUrl, wsSeatsEventsChannel, handleWebSocketMessage, fetched);

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
                lockerId: guestId
            }),
        };

        try {
            const response = await fetch(`${apiUrl}/seats/locks`, fetchConfig);

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
                                            seat.lockerId === guestId ? 'btn-primary' :
                                                seat.statusId === SeatStatus.AVAILABLE ? 'btn-success' :
                                                    seat.statusId === SeatStatus.LOCKED ? 'btn-warning' :
                                                        'btn-danger'
                                        }`}

                                        onClick={() => handleSeatClick(seat)}
                                    disabled={areAllSeatsDisabled || seat.statusId === SeatStatus.BOOKED || (seat.statusId===SeatStatus.LOCKED && seat.lockerId !== guestId)}
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