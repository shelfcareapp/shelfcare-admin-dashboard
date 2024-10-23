import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order } from 'types';
import { convertTimestampToISO } from 'utils/convert-timestamp-to-ISO';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const ordersSnapshot = await getDocs(collection(db, 'orders'));

  const orders = ordersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return convertTimestampToISO(
      {
        id: doc.id,
        ...data
      },
      true
    );
  });

  return orders as Order[];
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [] as Order[],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export const selectOrders = (state: any) => state.orders.orders;
export const selectLoading = (state: any) => state.orders.loading;
export const selectError = (state: any) => state.orders.error;

export default ordersSlice.reducer;
