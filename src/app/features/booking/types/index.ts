export interface ResponseMetadata {
    metadata: {
        requestId: string;
    };
}

export interface Event {
    id: number;
    name: string;
    type: number;
    dateTime: string;
    venueId: number;
}

export interface EventsResponse extends ResponseMetadata{
    data: Event[];
}

export enum SeatStatus {
    AVAILABLE = 1,
    LOCKED = 2,
    BOOKED = 3
}

export interface SeatDetails {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    guestId: string;
}

export interface Seat extends SeatDetails {
    id: number;
}

// WebSocket seat update (no ID)
export type SeatWs = SeatDetails;

export interface SeatsResponse extends ResponseMetadata{
    data: Seat[];
}

export interface BaseLockUnLockSeatRequest {
    eventId: number;
    venueId: number;
    rowNumber: string;
    seatNumber: string;
}

export interface LockSeatRequest extends BaseLockUnLockSeatRequest {
    guestId: string;
}

export type UnLockSeatRequest = BaseLockUnLockSeatRequest