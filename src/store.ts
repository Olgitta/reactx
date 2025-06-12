import { configureStore } from '@reduxjs/toolkit'
import {loginSlice} from "./features/auth/loginSlice.ts";
import {registerSlice} from "./features/auth/registerSlice.ts";

export const store = configureStore({
    reducer: {
        login: loginSlice.reducer,
        register: registerSlice.reducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch