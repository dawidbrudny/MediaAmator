// loginSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction  } from '@reduxjs/toolkit';
import { getLoginStatus } from '../components/pages/LoginPanel/utils/authenticationFunctions'
import { getSingleUser } from '../components/pages/LoginPanel/utils/getSingleUser';
import { getBanStatus } from '../components/pages/LoginPanel/utils/getBanStatus';
import { type DocumentData } from 'firebase/firestore'; // Import the DocumentData type

interface LoginState {
  isLoggedIn: null | boolean;
  userData: null | DocumentData;
  redirectAfterLogin: string | null;
  banned: null | boolean;
}

export const getLoginStatusAsync: ReturnType<typeof createAsyncThunk<boolean>> = createAsyncThunk(
  'login/getLoginStatus',
  async () => {
    const loginStatus = await getLoginStatus();
    return Boolean(loginStatus);
  }
);

export const getSingleUserAsync: ReturnType<typeof createAsyncThunk<DocumentData | null, string>> = createAsyncThunk(
  'login/getNickname',
  async (documentId) => {
    const response = await getSingleUser(documentId);
    return response;
  }
);

export const getCurrentUserBanStatusAsync: ReturnType<typeof createAsyncThunk<boolean | null> > = createAsyncThunk(
  'login/getCurrentUserBanStatus',
  async () => {
    const banStatus = await getBanStatus();
    return banStatus;
  }
);

const initialState: LoginState = {
  isLoggedIn: null,
  userData: null,
  redirectAfterLogin: null,
  banned: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    //  Reducer synchroniczny do ustawiania stanu logowania
    setLoginState: (state, action: PayloadAction<boolean | null>) => {
      state.isLoggedIn = action.payload;
    },
    setUserData: (state, action: PayloadAction<null>) => {
      state.userData = action.payload;
    },
    setRedirectAfterLogin(state, action: PayloadAction<string | null>) {
      state.redirectAfterLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoginStatusAsync.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
      })
      .addCase(getSingleUserAsync.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(getCurrentUserBanStatusAsync.fulfilled, (state, action) => {
        state.banned = action.payload;
      });
  },
});

export const { setLoginState, setUserData, setRedirectAfterLogin } = loginSlice.actions;
export default loginSlice.reducer;
export type { LoginState };