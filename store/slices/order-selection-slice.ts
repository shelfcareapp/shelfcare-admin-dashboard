import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Order, SelectedServices } from 'types';

interface OrderState {
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({
    selectedUser,
    selectedServices,
    totalPrice
  }: {
    selectedUser: any;
    selectedServices: SelectedServices[];
    totalPrice: number;
  }) => {
    const finalPrice = totalPrice + 10;

    const orderData = {
      customerId: selectedUser.id,
      customerName: selectedUser.name,
      customerEmail: selectedUser.email,
      services: selectedServices,
      totalPrice: finalPrice,
      pickupTime: '',
      deliveryTime: '',
      createdAt: new Date()
    };

    await addDoc(collection(db, 'orders'), orderData);

    toast.success('Order saved to the database successfully!');
    return orderData;
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ orderId, orderData }: { orderId: string; orderData: Order }) => {
    const updatedOrderData = {
      ...orderData
    };

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, updatedOrderData);

    toast.success('Order updated successfully!');
  }
);

// Other async thunks for deleting and updating order payment status

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(
      createOrder.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
        toast.error('Failed to send the request. Please try again.');
      }
    );
  }
});

export const selectOrderLoading = (state: any) => state.order.loading;
export const selectOrderError = (state: any) => state.order.error;

export default orderSlice.reducer;
