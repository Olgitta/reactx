import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {generateUuid} from '../../../shared/utils.ts';
import {useGetSeatsQuery, useLockSeatMutation, useUnlockSeatMutation} from './seatsApi';
import {seatStatusClass, seatStatusLabel} from './types';
import {useWebSocket} from "../../../shared/hooks/useWebSocket.ts";
import {appConfig} from "../../../configuration/appConfig.ts";
import {wsMessageHandler} from "./wsMessageHandler.ts";
import {RedisMessage} from "../../../shared/hooks/types.ts";
import {LockSeatRequest, Seat, SeatStatus, UnLockSeatRequest} from "../types";
import {getSeatClassName, isSeatDisabled} from "./helpers.ts";
import EventCard from "../events/EventCard.tsx";

const Seats: React.FC = () => {
    const {eventId, venueId} = useParams();
    const location = useLocation();
    const eventCard = location.state?.eventCard;
    const navigate = useNavigate()
    const {data, error, isLoading} = useGetSeatsQuery({
        eventId: Number(eventId),
        venueId: Number(venueId),
    });

    const [lockSeat] = useLockSeatMutation();
    const [unlockSeat] = useUnlockSeatMutation();

    const [seats, setSeats] = useState<Seat[]>([]);
    const [guestId, setGuestId] = useState<string | ''>('');

    useEffect(() => {
        if (!eventCard) {
            // Redirect if no state provided
            navigate("/events", { replace: true });
        }
    }, [eventCard, navigate]);

    useEffect(() => {
        const uuid = generateUuid();
        setGuestId(uuid);
    }, []);

    useEffect(() => {
        if (data?.data) {
            setSeats(data.data);
        }
    }, [data]);

    const handleOrderClick = () => {
        const seatsLockedByGuest = seats.map((seat: Seat) => {
            if(seat.guestId === guestId) {
                return seat;
            }
        })

        if(seatsLockedByGuest && seatsLockedByGuest.length > 0) {
            navigate('/order/summary', { state: { event: eventCard, lockedSeats: seatsLockedByGuest } });
        }

        return
    };

    const handleSeatClick = async (seat: Seat) => {
        try {
            const clicked = `${seat.rowNumber}-${seat.seatNumber}`;

            if (seat.statusId === SeatStatus.AVAILABLE) {
                // lockSeat
                const payload: LockSeatRequest = {
                    eventId: Number(eventId),
                    venueId: Number(venueId),
                    rowNumber: seat.rowNumber,
                    seatNumber: seat.seatNumber,
                    guestId: guestId
                }
                await lockSeat(payload).unwrap();
                console.log(`[Seats] Seat lock requested: ${clicked}`);
            }

            if (seat.statusId === SeatStatus.LOCKED && seat.guestId === guestId) {
                // unlockSeat
                const payload: UnLockSeatRequest = {
                    eventId: Number(eventId),
                    venueId: Number(venueId),
                    rowNumber: seat.rowNumber,
                    seatNumber: seat.seatNumber
                };
                await unlockSeat(payload).unwrap();
                console.log(`[Seats] Seat unlock requested: ${clicked}`);
            }
        } catch (error) {
            console.error('[Seats] Failed to lock seat:', error);
        }
    };

    const handleSocketMessage = useCallback((redisMessage: RedisMessage) => {
        console.log('[Seats] ws message:', redisMessage);
        const updatedSeat = wsMessageHandler(redisMessage, Number(eventId), Number(venueId));
        if (updatedSeat) {
            console.log('[Seats] Updated seat:', updatedSeat);
            setSeats(prevSeats => {
                return prevSeats.map(seat =>
                    seat.rowNumber === updatedSeat.rowNumber &&
                    seat.seatNumber === updatedSeat.seatNumber
                        ? {...seat, ...updatedSeat}
                        : seat
                );
            });
        }
    }, [eventId, venueId]);

    const {isConnected: isWsConnected} = useWebSocket(
        appConfig.ws.url,
        appConfig.ws.channels.seatsEventsChannelName,
        handleSocketMessage);

    if (!isWsConnected) return (
        <div className="container">
            <p>Connecting to ws...</p>
        </div>);

    if (isLoading) return (
        <div className="container">
            <p>Loading seats...</p>
        </div>);

    if (error || !data) return (
        <div className="container">
            <p>Error loading seats.</p>
        </div>);

    const groupedByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
        acc[seat.rowNumber] = acc[seat.rowNumber] || [];
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    return (
        <div className="container mt-4">

            <div className="d-flex flex-column gap-3">
                <EventCard event={eventCard} />
            </div>
            <div className="d-flex flex-column gap-3">
                <h4>Seat Selection</h4>
                {Object.entries(groupedByRow).map(([row, seats]) => (
                    <div key={row}>
                        <strong>Row {row}</strong>
                        <div className="d-flex gap-2 flex-wrap mt-1">
                            {seats.map((seat) => (
                                <button
                                    key={`${seat.rowNumber}-${seat.seatNumber}`}
                                    className={`${getSeatClassName(seat, guestId)} px-3 py-2`}
                                    disabled={isSeatDisabled(seat, guestId)}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    {seat.seatNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

                <div className="d-flex flex-column gap-3">
                    <button
                        className="btn btn-info  px-3 py-2"
                        disabled={false}
                        onClick={() => handleOrderClick()}
                    >Order</button>
                </div>

            <div>
                <h5>Legend:</h5>
                <div className="d-flex gap-3">
                    {Object.entries(seatStatusLabel).map(([status, label]) => (
                        <div key={status} className="d-flex align-items-center gap-2">
              <span
                  className={`badge ${seatStatusClass[status as unknown as SeatStatus]}`}
                  style={{width: 34, height: 24}}
              >{status}</span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Seats;
