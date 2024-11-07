import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { SelectedServices } from 'types';
import { sendMessage } from './chats-slice';

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
  async (
    {
      selectedUser,
      selectedServices,
      totalPrice,
      message
    }: {
      selectedUser: { id: string; name: string; email: string };
      selectedServices: SelectedServices[];
      totalPrice: number;
      message: string;
    },
    { dispatch }
  ) => {
    try {
      const finalPrice = totalPrice + 10;

      const orderData = {
        customerId: selectedUser.id,
        customerName: selectedUser.name,
        customerEmail: selectedUser.email,
        services: selectedServices,
        totalPrice: finalPrice,
        pickupTime: {
          date: '',
          time: ''
        },
        deliveryTime: {
          date: '',
          time: ''
        },
        status: 'pending_customer_input',
        createdAt: new Date().toString(),
        paymentEnabled: false
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = orderRef.id;

      const chatDocRef = doc(db, 'chats', selectedUser.id);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        await setDoc(chatDocRef, {
          messages: [],
          lastMessage: message,
          lastMessageTime: new Date().toString(),
          type: 'options',
          orderId
        });
      }

      await dispatch(
        sendMessage({
          selectedUserId: selectedUser.id,
          message,
          images: [],
          sender: 'Admin',
          type: 'options',
          orderId
        })
      );

      toast.success('Order automated message sent to user!');

      return { ...orderData, id: orderId };
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create order'
      );
      throw error;
    }
  }
);

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async (
    {
      id,
      selectedServices,
      totalPrice,
      message,
      userId
    }: {
      id: string;
      selectedServices: SelectedServices[];
      totalPrice: number;
      message?: string;
      userId?: string;
    },
    { dispatch }
  ) => {
    try {
      const finalPrice = totalPrice + 10;

      const orderData = {
        services: selectedServices,
        totalPrice: finalPrice,
        status: 'pending_customer_input'
      };

      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, orderData);

      if (message) {
        const chatDocRef = doc(db, 'chats', id);
        const chatDoc = await getDoc(chatDocRef);

        if (!chatDoc.exists()) {
          await setDoc(chatDocRef, {
            messages: [],
            lastMessage: message,
            lastMessageTime: new Date().toString(),
            type: 'yesno',
            orderId: id
          });
        } else {
          await updateDoc(chatDocRef, {
            lastMessage: message,
            lastMessageTime: new Date().toString()
          });
        }

        await dispatch(
          sendMessage({
            selectedUserId: userId,
            message,
            images: [],
            sender: 'Admin',
            type: 'yesno',
            orderId: id
          })
        );
      }

      return { ...orderData, id };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
      return orderDoc.data();
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async ({
    orderId,
    status,
    paymentEnabled
  }: {
    orderId: string;
    status?: string;
    paymentEnabled?: boolean;
  }) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus: status,
      paymentEnabled
    });

    toast.success('Payment status updated successfully!');
  }
);

export const updateOrderDetails = async (
  orderId: string,
  pickupTime: string,
  deliveryTime: string
) => {
  const orderDocRef = doc(db, 'orders', orderId);

  try {
    await updateDoc(orderDocRef, {
      pickupTime,
      deliveryTime,
      status: 'confirmed'
    });
  } catch (error) {
    console.error('Error updating order details:', error);
  }
};

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
      )
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
        toast.error('Failed to fetch the order. Please try again.');
      });
  }
});

export const selectOrderLoading = (state: any) => state.order.loading;
export const selectOrderError = (state: any) => state.order.error;

export default orderSlice.reducer;
