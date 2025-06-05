// types/Seat.ts
import {SeatStatus} from "../../enums.ts";

export interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    lockerId: string;
}
