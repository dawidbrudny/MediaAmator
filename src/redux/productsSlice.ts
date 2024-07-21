// features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductsData } from '../components/pages/ShopList/utils/getProductsData';
import { ProductProps } from '../components/pages/ShopList/Product';

interface ProductsState {
  products: ProductProps[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchProducts: ReturnType<typeof createAsyncThunk<ProductProps[]>> = createAsyncThunk(
  'products/fetchProducts', 
  async () => {
    const response = await getProductsData();

    if (!response) {
      throw new Error('Nie udało się pobrać produktów');
    }
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default productsSlice.reducer;
export type { ProductsState };