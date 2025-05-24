import React, {useEffect, useRef, useState} from 'react';

interface Seat {
    rowNumber: string;
    seatNumber: string;
    statusId: number; // 1 = available, 2 = locked, 3 = booked.
}

interface SeatApiResponse {
    data: Seat[];
    metadata: {
        requestId: string;
    };
}

const SeatMap: React.FC = () => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fetched = useRef(false);

    const fetchSeats = async () => {
        try {
            const res = await fetch('http://localhost:8081/seats/1/1');
            const json: SeatApiResponse = await res.json();
            setSeats(json.data);
        } catch (error) {
            console.error('Error fetching seats:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetchSeats();
        }
    }, []);

    const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
        if (!acc[seat.rowNumber]) {
            acc[seat.rowNumber] = [];
        }
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    const handleSeatClick = async (seat: Seat) => {
        if (seat.statusId == 3) return;

        const fetchConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventId: 1,
                venueId: 1,
                rowNumber: seat.rowNumber,
                seatNumber: seat.seatNumber,
            }),
        };

        if (seat.statusId == 2) {
            fetchConfig.method = 'DELETE';
        }

        try {
            const response = await fetch('http://localhost:8081/seats/locks', fetchConfig);

            if (response.ok) {
                console.log(`Seat ${seat.rowNumber}${seat.seatNumber} locked`);
                setSeats(prev =>
                    prev.map(s =>
                        s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
                            ? { ...s, statusId: seat.statusId == 2 ? 1 : 2 }
                            : s
                    )
                );
            } else {
                alert('Failed to lock seat');
            }
        } catch (error) {
            console.error('Error locking seat:', error);
        }
    };

    if (loading) {
        return <div className="text-center mt-4">Loading seats...</div>;
    }

    return (
        <div className="container mt-4">
            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="mb-4">
                    <h5>Row {row}</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {rowSeats.map(seat => (
                            <button
                                key={seat.seatNumber}
                                className={`btn ${seat.statusId === 1 ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleSeatClick(seat)}
                            >
                                {seat.seatNumber}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SeatMap;
