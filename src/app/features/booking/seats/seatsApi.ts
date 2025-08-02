import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {appConfig} from "../../../configuration/appConfig.ts";
import {resolvePath} from "../../../shared/utils.ts";
import {LockSeatRequest, SeatsResponse, UnLockSeatRequest} from "../types";

export const seatsApi = createApi({
    reducerPath: 'seatsApi',
    baseQuery: fetchBaseQuery({ baseUrl: appConfig.booking.api.baseUrl }),
    endpoints: (builder) => ({

        getSeats: builder.query<SeatsResponse, { eventId: number; venueId: number }>({
            query: ({ eventId, venueId }) => resolvePath(appConfig.booking.api.path.seats, {
                eventid: eventId,
                venueid: venueId,
            }),
            // transformResponse: (response: { data: Seat[] }) => response.data,
        }),

        lockSeat: builder.mutation<void, LockSeatRequest>({
            query: (body) => ({
                url: appConfig.booking.api.path.seatsLocks,
                method: 'POST',
                body,
                // If needed: include credentials or headers here
                // credentials: 'include',
            }),
        }),

        unlockSeat: builder.mutation<void, UnLockSeatRequest>({
            query: (body) => ({
                url: appConfig.booking.api.path.seatsLocks,
                method: 'DELETE',
                body,
                // If needed: include credentials or headers here
                // credentials: 'include',
            }),
        }),
    }),
})

export const { useGetSeatsQuery, useLockSeatMutation, useUnlockSeatMutation } = seatsApi;
