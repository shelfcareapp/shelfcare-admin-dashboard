import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
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
    totalPrice,
    discount
  }: {
    selectedUser: any;
    selectedServices: SelectedServices;
    totalPrice: number;
    discount: number;
  }) => {
    const discountAmount = totalPrice * (discount / 100);
    const finalPrice = totalPrice - discountAmount + 10;

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
    await deleteDoc(doc(db, 'orders', orderId));

    toast.success('Order deleted successfully!');
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async (data: { orderId: string; status: string }) => {
    const orderRef = doc(db, 'orders', data.orderId);
    await updateDoc(orderRef, {
      paymentStatus: data.status
    });

    toast.success('Order updated successfully!');
  }
);

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

    builder.addCase(updateOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateOrder.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(
      updateOrder.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order';
        toast.error('Failed to send the request. Please try again.');
      }
    );

    builder.addCase(deleteOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteOrder.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(
      deleteOrder.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete order';
        toast.error('Failed to send the request. Please try again.');
      }
    );

    builder.addCase(updatePaymentStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePaymentStatus.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(
      updatePaymentStatus.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update payment status';
        toast.error('Failed to send the request. Please try again.');
      }
    );
  }
});

export const selectOrderLoading = (state: any) => state.order.loading;
export const selectOrderError = (state: any) => state.order.error;

export default orderSlice.reducer;
