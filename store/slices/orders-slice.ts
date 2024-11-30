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

  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = usersSnapshot.docs.reduce((acc, doc) => {
    const userData = doc.data();
    acc[doc.id] = {
      id: doc.id,
      ...userData
    };
    return acc;
  }, {} as Record<string, any>);

  const enrichedOrders = orders.map((order) => {
    const user = users[order.customerId];
    if (user) {
      return {
        ...order,
        customerAddress: user.address || null,
        customerPhone: user.phone || null,
        customerCity: user.city || null,
        customerPostalCode: user.postalCode || null,
        customerEntranceInfo: user.doorInfo || null
      };
    }
    return order;
  });

  console.log('enrichedOrders', enrichedOrders);

  return enrichedOrders as Order[];
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
