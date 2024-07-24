// store.ts
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import productsReducer from './productsSlice';
import screenReducer from './screenSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    products: productsReducer,
    screen: screenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;