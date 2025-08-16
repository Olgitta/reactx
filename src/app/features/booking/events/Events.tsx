import React from 'react'
import { useGetEventsQuery } from './eventsApi'
import {useNavigate} from 'react-router-dom';
import EventCard from './EventCard.tsx';
import {Event} from '../types';
import PageTitle from '../../../shared/components/PageTitle.tsx';

const Events: React.FC = () => {
    const { data, error, isLoading } = useGetEventsQuery()
    const navigate = useNavigate()

    const handleClick = (event: Event) => {
        navigate('/seats', { state: { eventCard: event } })
    }

    if (isLoading) {
        return (
            <div className="alert alert-dismissible alert-secondary">
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                <strong>Well done!</strong> You successfully read <a href="#" className="alert-link">this important
                alert message</a>.
            </div>
        )
    }

    if (error || !data) return (
        <div className="alert alert-dismissible alert-danger">
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
            <strong>Oh snap!</strong> Something went wrong.
        </div>
    );

    return (
        <>
            <PageTitle title={'Events'} />

            <div className="row row-cols-2 row-cols-lg-3 g-2 g-lg-3">
                {data?.data.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        fromEvents={true}
                        onClick={() => handleClick(event)}
                    />
                ))}
            </div>
        </>
    )
}

export default Events
