import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Pages = 
'settings' 
| 'personal' 
| 'commentary' 
| 'purchases' 
| 'contact'
;

export type AdminPages =
'add-product'
| 'delete-product'
| 'users-list'
;


interface ScreenState {
    page: Pages;
    adminPage?: AdminPages;
}

const initialState: ScreenState = {
    page: 'settings',
    adminPage: 'add-product'
}

export const screenSlice = createSlice({
    name: 'screen',
    initialState,
    reducers: {
        setScreen: (state, action: PayloadAction<Pages>) => {
            state.page = action.payload;
        },
        setAdminScreen: (state, action: PayloadAction<AdminPages>) => {
            state.adminPage = action.payload;
        }
    }
});

export const { setScreen, setAdminScreen } = screenSlice.actions;
export default screenSlice.reducer;
export type { ScreenState };