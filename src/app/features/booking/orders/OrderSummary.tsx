import React, {useCallback, useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {Seat, Event, UnLockSeatRequest} from '../types';
import {useUnlockSeatMutation} from '../seats/seatsApi.ts';
import {useUnload} from '../../../shared/hooks/useUnload.ts';
import PageTitle from '../../../shared/components/PageTitle.tsx';
import QrCodeGenerator from '../../../shared/components/QrCodeGenerator.tsx';

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
            <PageTitle title={eventCard.name} text={new Date(eventCard.dateTime).toLocaleString()}/>

            {
                lockedSeats?.map((seat: Seat) => (
                    <div className={'d-flex flex-row mb-2 ' +
                        'border border-dark rounded ' +
                        'text-dark ' +
                        'p-2 col-12 col-lg-3'} style={{height: '100px'}}
                         key={`${seat.rowNumber}-${seat.seatNumber}`}>

                        <div className={'w-75'}>
                            <h5>{eventCard.name}</h5>
                            <h6>{new Date(eventCard.dateTime).toLocaleString()}</h6>
                            <h3>{seat.rowNumber}-{seat.seatNumber}</h3>
                        </div>
                        <div>
                            <QrCodeGenerator val={`${seat.rowNumber}${seat.seatNumber}`}/>
                        </div>
                    </div>
                ))
            }

        </>
    )
}

export default OrderSummary;