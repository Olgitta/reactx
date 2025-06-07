// types/Seat.ts
import {SeatStatus} from "../../enums";

export interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    lockerId: string;
}
