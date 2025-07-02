import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../../store.ts'
import {appConfig} from "../../configuration/appConfig.ts";

// Define a type for the slice state
interface RegisterState {
    email: string;
    username: string;
    guid: string;
    loading: boolean;
    error: string | null;
}

// Define the initial state using that type
const initialState: RegisterState = {
    email: '',
    username: '',
    guid: '',
    loading: false,
    error: null,
}

interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    email: string;
    username: string;
    guid: string;
}

export const register = createAsyncThunk<
    RegisterResponse,
    RegisterPayload,
    { rejectValue: string }
>(
    'auth/register',
    async (payload: RegisterPayload, {rejectWithValue}) => {
        try {
            const res = await fetch(`${appConfig.qweb.api.baseUrl}${appConfig.qweb.api.path.register}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                return rejectWithValue('Registration failed');
            }

            return (await res.json()) as RegisterResponse;
        } catch (err) {
            return rejectWithValue(`Network error: ${err}`);
        }
    }
);

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setRegisterResponse: (state, action: PayloadAction<RegisterResponse>) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.guid = action.payload.guid;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.username = action.payload.username;
                state.email = action.payload.email;
                state.guid = action.payload.guid;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            });
    }
})

// export const {logout} = registerSlice.actions;

// Optional selectors
export const selectRegister = (state: RootState) => state.register;

export default registerSlice.reducer;