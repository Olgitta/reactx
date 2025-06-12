// types/Seat.ts
import {SeatStatus} from "../types";

export interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    lockerId: string;
}
