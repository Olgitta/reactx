import {SeatStatus} from "../types";

export const seatStatusLabel = {
    [SeatStatus.AVAILABLE]: 'Available',
    [SeatStatus.LOCKED]: 'Locked',
    [SeatStatus.BOOKED]: 'Booked',
    100: 'Locked by me',
};

export const seatStatusClass = {
    [SeatStatus.AVAILABLE]: 'btn btn-success',
    [SeatStatus.LOCKED]: 'btn btn-warning',
    [SeatStatus.BOOKED]: 'btn btn-danger',
    100: 'btn btn-info',
};
