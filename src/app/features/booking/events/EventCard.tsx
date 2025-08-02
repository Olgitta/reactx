import React from 'react'

interface EventCardProps {
    event: {
        id: number
        name: string
        dateTime: string
        type: number
        venueId: number
    }
    onClick?: () => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    return (
        <div
            className="col-sm-6 col-md-4"
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h4 className="panel-title">{event.name}</h4>
                </div>
                <div className="panel-body">
                    <p>
                        <strong>Datetime:</strong>
                        <br /> {new Date(event.dateTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>Type:</strong> {event.type === 1 ? 'Concert' : 'Movie'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EventCard
