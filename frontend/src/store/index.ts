import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import menuReducer from './menuSlice';
import itemReducer from './itemSlice';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        menu: menuReducer,
        item: itemReducer,
        user: userReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export default store;
