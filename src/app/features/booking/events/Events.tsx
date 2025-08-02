import React from 'react'
import { useGetEventsQuery } from './eventsApi'
import {useNavigate} from "react-router-dom";
import EventCard from "./EventCard.tsx";
import {Event} from "../types";

const Events: React.FC = () => {
    const { data, error, isLoading } = useGetEventsQuery()
    const navigate = useNavigate()

    const handleClick = (event: Event) => {
        navigate(`/seats/${event.id}/${event.venueId}`, { state: { eventCard: event } })
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
                Loading...
            </div>
        )
    }

    return (
        <div className="container">
            <h2 className="text-center">Events</h2>
            <div className="row">
                {data?.data.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => handleClick(event)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Events
