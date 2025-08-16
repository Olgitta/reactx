import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import clsx from 'clsx';
// import {generateUuid} from '../../../shared/utils.ts';
import {useGetSeatsQuery, useLockSeatMutation, useUnlockSeatMutation} from './seatsApi';
import {useWebSocket} from '../../../shared/hooks/useWebSocket.ts';
import {appConfig} from '../../../configuration/appConfig.ts';
import {wsMessageHandler} from './wsMessageHandler.ts';
import {RedisMessage} from '../../../shared/hooks/types.ts';
import {Event, LockSeatRequest, Seat, SeatStatus, UnLockSeatRequest} from '../types';
import {isSeatAvailable, isSeatDisabled, isSeatLockedByMe} from './helpers.ts';
import EventCard from '../events/EventCard.tsx';
import {useUnload} from '../../../shared/hooks/useUnload.ts';
import {useAppSelector} from '../../../appHooks.ts';
import {RootState} from '../../../store.ts';
import PageTitle from '../../../shared/components/PageTitle.tsx';

const Seats: React.FC = () => {
    const guestId = useAppSelector((state: RootState) => state.guest.guestId);
    const location = useLocation();
    const doUnlockRef = useRef<boolean>(false);
    const eventCard: Event = location.state?.eventCard;

    const navigate = useNavigate()

    const {data, error, isLoading} = useGetSeatsQuery({
        eventId: eventCard.id,
        venueId: eventCard.venueId,
    });

    const [lockSeat] = useLockSeatMutation();
    const [unlockSeat] = useUnlockSeatMutation();

    const [seats, setSeats] = useState<Seat[]>([]);
    const seatsRef = useRef<Seat[]>([]);

    // const [guestId, setGuestId] = useState<string>('');
    // const guestIdRef = useRef<string>('');

    useEffect(() => {
        if (!eventCard) {
            // Redirect if no state provided
            navigate('/events', {replace: true});
        }
    }, [eventCard, navigate]);

    // useEffect(() => {
    //     const uuid = generateUuid();
    //     setGuestId(uuid);
    // }, []);

    useEffect(() => {
        if (data?.data) {
            setSeats(data.data);
        }
    }, [data]);

    // useEffect(() => {
    //     seatsRef.current = seats;
    //     if (error || !data) {
    //         return;
    //     }
    //
    //     console.log(toLocalStorage);
    //     LocalStorageHelper.saveItem('seatsLockedByMe', toLocalStorage);
    // }, [seats]);

    // useEffect(() => {
    //     guestIdRef.current = guestId;
    // }, [guestId]);

    const getSeatsLockedByMe = () => {
        return seatsRef.current.filter(s => s.guestId === guestId);
    };

    const unlockSeatsLockedByMe = useCallback(() => {
        if (!doUnlockRef.current) {
            doUnlockRef.current = true;
            return;
        }

        const seatsLockedByMe = getSeatsLockedByMe();

        seatsLockedByMe.forEach(seat => {
            const payload: UnLockSeatRequest = {
                eventId: eventCard.id,
                venueId: eventCard.venueId,
                rowNumber: seat.rowNumber,
                seatNumber: seat.seatNumber
            };
            unlockSeat(payload).unwrap();
            console.log('[Seats] unlock seat', payload);
        });
    }, [eventCard, unlockSeat]);

    useUnload(unlockSeatsLockedByMe);

    const handleOrderClick = () => {
        const seatsLockedByMe = seats.filter(s => s.guestId === guestId);

        if (seatsLockedByMe && seatsLockedByMe.length > 0) {
            navigate('/order/summary', {
                state: {
                    event: eventCard,
                    lockedSeats: seatsLockedByMe,
                    guestId: guestId
                }
            });
        }

        return
    };

    const handleSeatClick = async (seat: Seat) => {
        try {
            const clicked = `${seat.rowNumber}-${seat.seatNumber}`;

            if (seat.statusId === SeatStatus.AVAILABLE) {
                // lockSeat
                const payload: LockSeatRequest = {
                    eventId: eventCard.id,
                    venueId: eventCard.venueId,
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
                    eventId: eventCard.id,
                    venueId: eventCard.venueId,
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
        const updatedSeat = wsMessageHandler(redisMessage, eventCard.id, eventCard.venueId);
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
    }, [eventCard.id, eventCard.venueId]);

    const {isConnected: isWsConnected} = useWebSocket(
        appConfig.ws.url,
        appConfig.ws.channels.seatsEventsChannelName,
        handleSocketMessage);

    if (!isWsConnected) return (
        <div className="alert alert-dismissible alert-secondary">
            Connecting Loading ...
        </div>
    );

    if (isLoading) {
        return (
            <div className="alert alert-dismissible alert-secondary">
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                <strong>Well done!</strong> You successfully read <a href="#" className="alert-link">this important
                alert message</a>.
            </div>
        )
    }

    if (error || !data) return (
        <div className="alert alert-dismissible alert-danger">
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            <strong>Oh snap!</strong> Something went wrong.
        </div>
    );

    const groupedByRow = seats.reduce((acc: Record<string, Seat[]>, seat) => {
        acc[seat.rowNumber] = acc[seat.rowNumber] || [];
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    return (
        <>

        <PageTitle title={'Seats selection'} />

            <div className="row row-cols-1 row-cols-lg-3 g-2 g-lg-3">

                <EventCard event={eventCard}/>

                <div className="col">
                    <div className="p-1">

                        {Object.entries(groupedByRow).map(([row, seats]) => (
                            <div key={row}>
                                <h6>Row {row}</h6>
                                {seats.map((seat) => (
                                    <button
                                        key={`${seat.rowNumber}-${seat.seatNumber}`}
                                        className={clsx(
                                            'mb-1 me-1 btn',
                                            isSeatLockedByMe(seat, guestId)
                                                ? 'btn-info'
                                                : isSeatAvailable(seat)
                                                    ? 'btn-success'
                                                    : 'btn-light'
                                        )}
                                        disabled={isSeatDisabled(seat, guestId)}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.seatNumber}
                                    </button>
                                ))}
                            </div>
                        ))}

                    </div>
                </div>

            </div>

            <div className="row row-cols-1 row-cols-lg-3 g-2 g-lg-3">
                <div className="col">
                    <button
                        className="btn btn-primary btn-lg w-100"
                        disabled={false}
                        onClick={handleOrderClick}
                    >
                        Order
                    </button>
                </div>
            </div>
        </>
    );

};

export default Seats;
