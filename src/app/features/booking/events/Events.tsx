import React from 'react'
import { useGetEventsQuery } from './eventsApi'
import {useNavigate} from "react-router-dom";

const Events: React.FC = () => {
    const { data, error, isLoading } = useGetEventsQuery()
    const navigate = useNavigate()

    const handleClick = (eventId: number, venueId: number) => {
        navigate(`/seats/${eventId}/${venueId}`)
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                Ошибка при загрузке мероприятий.
            </div>
        )
    }

    return (
        <div className="container">
            <h2 className="text-center">Список мероприятий</h2>
            <div className="row">
                {data?.data.map((event) => (
                    <div
                        className="col-sm-6 col-md-4"
                        key={event.id}
                        onClick={() => handleClick(event.id, event.venueId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h4 className="panel-title">{event.name}</h4>
                            </div>
                            <div className="panel-body">
                                <p><strong>Дата и время:</strong><br /> {new Date(event.dateTime).toLocaleString()}</p>
                                <p><strong>Venue ID:</strong> {event.venueId}</p>
                                <p><strong>Тип:</strong> {event.type === 1 ? 'Концерт' : 'Кино'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Events
