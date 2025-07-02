export enum SeatStatus {
    AVAILABLE = 1,
    LOCKED = 2,
    BOOKED = 3
}

export const seatStatusLabel = {
    [SeatStatus.AVAILABLE]: 'Available',
    [SeatStatus.LOCKED]: 'Locked',
    [SeatStatus.BOOKED]: 'Booked',
};
export interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: SeatStatus;
    lockerId: string;
}

export const seatStatusClass = {
    [SeatStatus.AVAILABLE]: 'btn btn-success',
    [SeatStatus.LOCKED]: 'btn btn-warning',
    [SeatStatus.BOOKED]: 'btn btn-danger',
};

export interface SeatApiResponse {
    data: Seat[];
    metadata: {
        requestId: string;
    };
}

export interface LockSeatRequest {
    eventId: number;
    venueId: number;
    rowNumber: string;
    seatNumber: string;
    lockerId: string;
}