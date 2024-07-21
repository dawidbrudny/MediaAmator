// store.ts
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;