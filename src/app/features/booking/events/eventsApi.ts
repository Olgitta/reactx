import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {appConfig} from "../../../configuration/appConfig.ts";

export interface Event {
    id: number;
    name: string;
    type: number;
    dateTime: string;
    venueId: number;
}

interface EventsResponse {
    data: Event[];
    metadata: {
        requestId: string;
    };
}

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({ baseUrl: appConfig.booking.api.baseUrl }),
    endpoints: (builder) => ({
        getEvents: builder.query<EventsResponse, void>({
            query: () => appConfig.booking.api.path.events
        })
    }),
})

export const { useGetEventsQuery } = eventsApi;
