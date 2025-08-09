import {Seat, SeatStatus} from '../types';
import {seatStatusClass} from './types.ts';

export const isSeatDisabled = (seat:Seat, userId:string) : boolean => {
    if(seat.statusId === SeatStatus.LOCKED && userId !== seat.guestId) {
        return true;
    }

    if(seat.statusId === SeatStatus.BOOKED) {
        return true;
    }

    return false;
}

export const getSeatClassName = (seat:Seat , userId:string) : string => {
    if(seat.statusId === SeatStatus.LOCKED && userId === seat.guestId) {
        return seatStatusClass[100];
    }

    return seatStatusClass[seat.statusId];
}

export const isSeatAvailable = (seat:Seat) : boolean => {
    return seat.statusId === SeatStatus.AVAILABLE;
}

export const isSeatLockedByMe = (seat:Seat , userId:string) : boolean => {
    return seat.statusId === SeatStatus.LOCKED && userId === seat.guestId;
}