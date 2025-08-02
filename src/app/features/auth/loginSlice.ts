import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from '../../store.ts'
import {appConfig} from '../../configuration/appConfig.ts';

// Define a type for the slice state
interface LoginState {
    accessToken: string;
    refreshToken: string;
    loading: boolean;
    error: string | null;
}

// Define the initial state using that type
const initialState: LoginState = {
    accessToken: '',
    refreshToken: '',
    loading: false,
    error: null,
}

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const login = createAsyncThunk<
    LoginResponse,
    LoginPayload,
    { rejectValue: string }
>(
    'auth/login',
    async (payload: LoginPayload, {rejectWithValue}) => {
        try {
            const res = await fetch(`${appConfig.qweb.api.baseUrl}${appConfig.qweb.api.path.login}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                return rejectWithValue('Login failed');
            }

            return (await res.json()) as LoginResponse;
        } catch (err) {
            return rejectWithValue(`Network error: ${err}`);
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        logout: (state) => {
            state.accessToken = '';
            state.refreshToken = '';
            state.loading = false;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        setTokens: (state, action: PayloadAction<LoginResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loading = false;
                state.error = null;

                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            });
    }
})

export const {logout} = loginSlice.actions;

// Optional selectors
export const selectAuth = (state: RootState) => state.login;

export default loginSlice.reducer;