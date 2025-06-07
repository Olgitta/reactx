// SeatRow.tsx
import SeatButton from "./SeatButton.tsx";

const SeatRow = ({ row, seats, onClick, guestId, isConnected }) => {
    return (
        <div className="mb-4">
            <h5>Row {row}</h5>
            <div className="d-flex flex-wrap gap-2">
                {seats.map(seat => (
                    <SeatButton
                        key={`${seat.rowNumber}-${seat.seatNumber}`}
                        seat={seat}
                        onClick={onClick}
                        guestId={guestId}
                        isConnected={isConnected}
                    />
                ))}
            </div>
        </div>
    );
};

export default SeatRow;
