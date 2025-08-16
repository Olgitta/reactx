import React, {useCallback, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {Seat, Event, UnLockSeatRequest} from '../types';
import {useUnlockSeatMutation} from '../seats/seatsApi.ts';
import {useUnload} from '../../../shared/hooks/useUnload.ts';
import PageTitle from "../../../shared/components/PageTitle.tsx";

const OrderSummary: React.FC = () => {
    const location = useLocation();
    const doUnlockRef = useRef<boolean>(false);
    const eventCard:Event = location.state?.event;
    const lockedSeats:Seat[] = location.state?.lockedSeats;
    const lockedSeatsRef = useRef<Seat[]>(lockedSeats);
    const guestId = location.state?.guestId;
    const [unlockSeat] = useUnlockSeatMutation();

    const unlockAllSeats = useCallback(()=> {
        if(!doUnlockRef.current){
            doUnlockRef.current = true;
            return;
        }

        lockedSeatsRef.current.forEach(seat=>{
            const payload: UnLockSeatRequest = {
                eventId: eventCard.id,
                venueId: eventCard.venueId,
                rowNumber: seat.rowNumber,
                seatNumber: seat.seatNumber
            };
            unlockSeat(payload).unwrap();
            console.log('[OrderSummary] unlock seat', payload);
        });
    }, []);

    useUnload(unlockAllSeats);

    // useEffect(() => {
    //
    //     const handleBeforeUnload = () => {
    //         unlockAllSeats();
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     // Функция, которая вернётся из useEffect, сработает при размонтировании компонента.
    //     return () => {
    //         if(!doUnlockRef.current){
    //             doUnlockRef.current = true;
    //             return;
    //         }
    //
    //         unlockAllSeats();
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);// Пустой массив зависимостей означает, что этот эффект сработает только один раз при монтировании и один раз при размонтировании.

    return (
        <>
            <PageTitle title={'Order Summary'} />

            <div className="row">
                <div className="col">
                    <div className="page-header">
                        <h3 className="page-title">{eventCard.name}</h3>
                        <p>guestId: {guestId}</p>
                        {
                            lockedSeats?.map((seat:Seat) => (
                                <p
                                    key={`${seat.rowNumber}-${seat.seatNumber}`}>
                                    {seat.statusId} - {seat.rowNumber} - {seat.seatNumber} - {seat.guestId}
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSummary;