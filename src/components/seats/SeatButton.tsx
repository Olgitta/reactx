// SeatButton.tsx
import {SeatStatus} from "../../enums";

const SeatButton = ({ seat, onClick, guestId, isConnected }) => {
    const getClass = () => {
        if (seat.lockerId === guestId) return 'btn-primary';
        if (seat.statusId === SeatStatus.AVAILABLE) return 'btn-success';
        if (seat.statusId === SeatStatus.LOCKED) return 'btn-warning';
        return 'btn-danger';
    };

    const disabled =
        !isConnected ||
        seat.statusId === SeatStatus.BOOKED ||
        (seat.statusId === SeatStatus.LOCKED && seat.lockerId !== guestId);

    return (
        <button
            className={`btn ${getClass()}`}
            onClick={() => onClick(seat)}
            disabled={disabled}
            title={`Seat ${seat.rowNumber}${seat.seatNumber}`}
        >
            {seat.seatNumber}
        </button>
    );
};

export default SeatButton;