// loginSlice.ts
import { createSlice, PayloadAction,  } from '@reduxjs/toolkit';
import { getLoginStatus } from '../components/pages/LoginPanel/utils/authenticationFunctions';

export type LoginState = {
  isLoggedIn: boolean | null;
}

async function getLoginStatusAsync(): Promise<boolean> {
  const loginStatus = await getLoginStatus();
  return Boolean(loginStatus);
}

const bool = await getLoginStatusAsync();

const initialState: LoginState = {
  isLoggedIn: Boolean(bool),
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // Reducer synchroniczny do ustawiania stanu logowania
    setLoginState: (state, action: PayloadAction<boolean | null>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setLoginState } = loginSlice.actions;
export default loginSlice.reducer;