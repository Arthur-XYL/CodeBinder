import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    uuid: string
}

const initialState: UserState = {
    uuid: ""
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUUID: (state, action: PayloadAction<string>) => {
            state.uuid = action.payload;
        },
        clearUUID: (state) => {
            state.uuid = "";
        }
    }
});

export const { setUUID, clearUUID } = userSlice.actions;
export default userSlice.reducer;