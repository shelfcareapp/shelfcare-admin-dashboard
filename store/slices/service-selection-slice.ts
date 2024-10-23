import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedServices } from 'types';

interface ServiceSelectionState {
  selectedServices: SelectedServices;
  totalPrice: number;
}

const initialState: ServiceSelectionState = {
  selectedServices: {},
  totalPrice: 0
};

const serviceSelectionSlice = createSlice({
  name: 'serviceSelection',
  initialState,
  reducers: {
    setSelectedServices: (state, action: PayloadAction<SelectedServices>) => {
      state.selectedServices = action.payload;
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },
    calculateTotalPrice: (state) => {
      const totalPrice = Object.values(state.selectedServices).reduce(
        (total, service) => total + service.quantity * service.price,
        0
      );
      state.totalPrice = totalPrice;
    }
  }
});

export const { setSelectedServices, setTotalPrice, calculateTotalPrice } =
  serviceSelectionSlice.actions;
export const selectSelectedServices = (state: any) =>
  state.serviceSelection.selectedServices;
export const selectTotalPrice = (state: any) =>
  state.serviceSelection.totalPrice;

export default serviceSelectionSlice.reducer;
