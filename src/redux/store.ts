// store.ts
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import productsReducer from './productsSlice';
import screenReducer from './screenSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    products: productsReducer,
    screen: screenReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;