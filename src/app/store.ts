import { configureStore } from '@reduxjs/toolkit'
import {loginSlice} from './features/auth/loginSlice.ts';
import {registerSlice} from './features/register/registerSlice.ts';
import {eventsApi} from './features/booking/events/eventsApi.ts';
import {seatsApi} from './features/booking/seats/seatsApi.ts';

export const store = configureStore({
    reducer: {
        login: loginSlice.reducer,
        register: registerSlice.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [seatsApi.reducerPath]: seatsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            eventsApi.middleware,
            seatsApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch