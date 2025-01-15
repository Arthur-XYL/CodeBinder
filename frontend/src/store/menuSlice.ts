import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuState } from '../types/itemTypes';

const initialState: MenuState = {
    activeMenu: 'binder'
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveMenu: (state, action: PayloadAction<MenuState['activeMenu']>) => {
            state.activeMenu = action.payload;
        }
    }
});

export const { setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;