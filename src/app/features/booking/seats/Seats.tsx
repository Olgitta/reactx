import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useGetSeatsQuery, useLockSeatMutation, useUnlockSeatMutation} from './seatsApi';
import {SeatStatus, seatStatusClass, seatStatusLabel, Seat} from './types';
import {useWebSocket} from "../../../shared/hooks/useWebSocket.ts";
import {appConfig} from "../../../configuration/appConfig.ts";
import {wsMessageHandler} from "./wsMessageHandler.ts";
import {RedisMessage} from "../../../shared/hooks/types.ts";

const Seats: React.FC = () => {
    const {eventId, venueId} = useParams();

    const {data, error, isLoading} = useGetSeatsQuery({
        eventId: Number(eventId),
        venueId: Number(venueId),
    });

    const [lockSeat] = useLockSeatMutation();
    const [unlockSeat] = useUnlockSeatMutation();

    const [seats, setSeats] = useState<Seat[]>([]);

    useEffect(() => {
        if (data?.data) {
            setSeats(data.data);
        }
    }, [data]);

    // channel
    //     :
    //     "seat:events:1_1"
    // message
    //     :
    //     "[2,\"A\",\"5\",\"abc\"]"
    // pattern
    //     :
    //     "seat:events:*_*"

    const handleSeatClick = async (seat: Seat) => {
        try {
            if (seat.statusId === SeatStatus.AVAILABLE) {
                await lockSeat({
                    eventId: Number(eventId),
                    venueId: Number(venueId),
                    rowNumber: seat.rowNumber,
                    seatNumber: seat.seatNumber,
                    lockerId: 'abc', // you may want to use real guestId from useGuestId()
                }).unwrap();
                console.log(`[Seats] Seat lock requested: ${seat.rowNumber}-${seat.seatNumber}`);
            }

            if (seat.statusId === SeatStatus.LOCKED) {
                await unlockSeat({
                    eventId: Number(eventId),
                    venueId: Number(venueId),
                    rowNumber: seat.rowNumber,
                    seatNumber: seat.seatNumber,
                    lockerId: 'abc', // you may want to use real guestId from useGuestId()
                }).unwrap();
                console.log(`[Seats] Seat unlock requested: ${seat.rowNumber}-${seat.seatNumber}`);
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
            <h3>Seat Selection</h3>
            <div className="d-flex flex-column gap-3">
                {Object.entries(groupedByRow).map(([row, seats]) => (
                    <div key={row}>
                        <strong>Row {row}</strong>
                        <div className="d-flex gap-2 flex-wrap mt-1">
                            {seats.map((seat) => (
                                <button
                                    key={`${seat.rowNumber}-${seat.seatNumber}`}
                                    className={`${seatStatusClass[seat.statusId]} px-3 py-2`}
                                    disabled={seat.statusId === SeatStatus.BOOKED}
                                    onClick={() => handleSeatClick(seat)}
                                >
                                    {seat.seatNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <hr/>
            <div>
                <h5>Legend:</h5>
                <div className="d-flex gap-3">
                    {Object.entries(seatStatusLabel).map(([status, label]) => (
                        <div key={status} className="d-flex align-items-center gap-2">
              <span
                  className={`badge ${seatStatusClass[status as unknown as SeatStatus]}`}
                  style={{width: 24, height: 24}}
              ></span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Seats;
