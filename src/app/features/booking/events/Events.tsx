import React from 'react'
import {useGetEventsQuery} from './eventsApi'
import {useNavigate} from 'react-router-dom';
import EventCard from './EventCard.tsx';
import {Event} from '../types';
import PageTitle from '../../../shared/components/PageTitle.tsx';
import Alert from '../../../shared/components/Alert.tsx';

const Events: React.FC = () => {
    const {data, error, isLoading} = useGetEventsQuery()
    const navigate = useNavigate()

    const handleClick = (event: Event) => {
        navigate('/seats', {state: {eventCard: event}})
    }

    if (isLoading) {
        return (
            <Alert loading={true} text="Loading..."/>
        )
    }

    if (error || !data) {
        return (
            <Alert error={true} text="Something went wrong..."/>
        )
    }

    return (
        <>
            <PageTitle title={'Events'}/>

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
