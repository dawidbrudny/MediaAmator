import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductProps } from '../components/pages/ShopList/Product';

interface CartItem extends ProductProps {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  quantity: number;
  sum: number;
}

let initialState: CartState = {
  items: [],
  quantity: 0,
  sum: 0,
};

const savedCart = localStorage.getItem('cart');
if (savedCart) {
  initialState = JSON.parse(savedCart);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrRemoveFromCart: (state, action: PayloadAction<{ product: ProductProps, isAdding: boolean }>) => {
      const { product, isAdding } = action.payload;
      const existingProduct = state.items.find(item => item.name === product.name);

      if (isAdding) {
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }
        state.quantity += 1;
        state.sum += product.price;
      } else {
        if (existingProduct) {
          existingProduct.quantity -= 1;
          state.quantity -= 1;
          state.sum -= product.price;

          if (existingProduct.quantity === 0) {
            state.items = state.items.filter(item => item.name !== product.name);
          }
        }
      }

      localStorage.setItem('cart', JSON.stringify(state));
    },
    resetCart: (state) => {
      state.items = [];
      state.quantity = 0;
      state.sum = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addOrRemoveFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
export type { CartState };