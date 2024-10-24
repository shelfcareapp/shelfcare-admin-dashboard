import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedServices } from 'types';
import { v4 as uuidv4 } from 'uuid'; // Use UUID library to generate unique IDs

interface ServiceSelectionState {
  selectedServices: SelectedServices[];
  totalPrice: number;
}

const initialState: ServiceSelectionState = {
  selectedServices: [],
  totalPrice: 0
};

const serviceSelectionSlice = createSlice({
  name: 'serviceSelection',
  initialState,
  reducers: {
    addSelectedService: (
      state,
      action: PayloadAction<Omit<SelectedServices, 'id'>>
    ) => {
      const newService = {
        ...action.payload,
        id: uuidv4() // Generate unique ID
      };
      state.selectedServices.push(newService);
      state.totalPrice +=
        newService.price *
        newService.quantity *
        (1 - (newService.discount || 0) / 100);
    },
    removeSelectedService: (state, action: PayloadAction<string>) => {
      state.selectedServices = state.selectedServices.filter(
        (service) => service.id !== action.payload
      );
      state.totalPrice = state.selectedServices.reduce(
        (total, service) =>
          total +
          service.price *
            service.quantity *
            (1 - (service.discount || 0) / 100),
        0
      );
    },
    updateSelectedService: (state, action: PayloadAction<SelectedServices>) => {
      const index = state.selectedServices.findIndex(
        (service) => service.id === action.payload.id
      );
      if (index >= 0) {
        state.selectedServices[index] = action.payload;
      }
      state.totalPrice = state.selectedServices.reduce(
        (total, service) =>
          total +
          service.price *
            service.quantity *
            (1 - (service.discount || 0) / 100),
        0
      );
    },
    setTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    }
  }
});

export const {
  addSelectedService,
  removeSelectedService,
  updateSelectedService,
  setTotalPrice
} = serviceSelectionSlice.actions;

export const selectSelectedServices = (state: any) =>
  state.serviceSelection.selectedServices;
export const selectTotalPrice = (state: any) =>
  state.serviceSelection.totalPrice;

export default serviceSelectionSlice.reducer;
