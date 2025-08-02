import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {appConfig} from '../../../configuration/appConfig.ts';
import {EventsResponse} from '../types';

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
