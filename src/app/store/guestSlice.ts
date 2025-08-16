import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface GuestState {
    guestId: string;
}

// Load from localStorage or create a new one
const getInitialGuestId = (): string => {
    const storedId = localStorage.getItem('guestId');
    if (storedId) return storedId;

    const newId = uuidv4();
    localStorage.setItem('guestId', newId);
    return newId;
};

const initialState: GuestState = {
    guestId: getInitialGuestId(),
};

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        setGuestId(state, action: PayloadAction<string>) {
            state.guestId = action.payload;
            localStorage.setItem('guestId', action.payload);
        },
        clearGuestId(state) {
            state.guestId = '';
            localStorage.removeItem('guestId');
        },
    },
});

export const { setGuestId, clearGuestId } = guestSlice.actions;
export default guestSlice.reducer;
