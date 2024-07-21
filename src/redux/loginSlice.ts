// loginSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction  } from '@reduxjs/toolkit';
import { getLoginStatus } from '../components/pages/LoginPanel/utils/authenticationFunctions'

interface LoginState {
  isLoggedIn: boolean | null;
}

export const getLoginStatusAsync: ReturnType<typeof createAsyncThunk<boolean>> = createAsyncThunk(
  'login/getLoginStatus',
  async () => {
    const loginStatus = await getLoginStatus();
    return Boolean(loginStatus);
  }
);

const initialState: LoginState = {
  isLoggedIn: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    //  Reducer synchroniczny do ustawiania stanu logowania
    setLoginState: (state, action: PayloadAction<boolean | null>) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLoginStatusAsync.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload;
    });
  },
});

export const { setLoginState } = loginSlice.actions;
export default loginSlice.reducer;
export type { LoginState };