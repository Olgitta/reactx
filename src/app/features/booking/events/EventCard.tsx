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
    fromEvents?: boolean
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, fromEvents }) => {
    return (
        <div className="col">
            <div className={`p-1 ${fromEvents ? 'h-100' : ''}`}>
                <div className={`card border-primary mb-3 ${fromEvents ? 'h-100' : ''}`}
                     style={{cursor: onClick ? 'pointer' : 'default'}}
                     onClick={onClick}>
                    <div className="card-header">{event.name}</div>
                    <div className="card-body">
                        <h4 className="card-title">{new Date(event.dateTime).toLocaleString()}</h4>
                        <p className="card-text">{event.type === 1 ? 'Concert' : 'Movie'}</p>
                    </div>
                </div>
            </div>
        </div>
)
}

export default EventCard
