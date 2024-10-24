import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
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

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);

    toast.success('Order deleted successfully!');
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async ({ orderId, status }: { orderId: string; status: string }) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus: status
    });

    toast.success('Payment status updated successfully!');
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
        toast.error('Failed to send the request. Please try again.');
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.loading = false;
        toast.success('Order updated successfully!');
      })
      .addCase(updateOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order';
        toast.error('Failed to update the order. Please try again.');
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        toast.success('Order deleted successfully!');
      })
      .addCase(deleteOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete order';
        toast.error('Failed to delete the order. Please try again.');
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state) => {
        state.loading = false;
        toast.success('Payment status updated successfully!');
      })
      .addCase(
        updatePaymentStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to update payment status';
          toast.error('Failed to update payment status. Please try again.');
        }
      );
  }
});

export const selectOrderLoading = (state: any) => state.order.loading;
export const selectOrderError = (state: any) => state.order.error;

export default orderSlice.reducer;
