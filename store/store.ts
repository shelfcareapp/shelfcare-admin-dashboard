import { configureStore } from '@reduxjs/toolkit';
import userSelectionReducer from './slices/user-selection-slice';
import usersReducer from './slices/users-slice';
import serviceSelectionReducer from './slices/service-selection-slice';
import orderSelectionReducer from './slices/order-selection-slice';
import ordersReducer from './slices/orders-slice';

export const store = configureStore({
  reducer: {
    userSelection: userSelectionReducer,
    serviceSelection: serviceSelectionReducer,
    order: orderSelectionReducer,
    users: usersReducer,
    orders: ordersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
