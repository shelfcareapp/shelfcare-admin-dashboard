import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SelectedServices } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { DELIVERY_FEE } from '../../constants';

interface ServiceSelectionState {
  selectedServices: SelectedServices[];
  totalPrice: number;
  deliveryFee: number;
  additionalInfo?: string;
}

const initialState: ServiceSelectionState = {
  selectedServices: [],
  totalPrice: 0,
  deliveryFee: DELIVERY_FEE,
  additionalInfo: ''
};

const serviceSelectionSlice = createSlice({
  name: 'serviceSelection',
  initialState,
  reducers: {
    setSelectedServices: (state, action: PayloadAction<SelectedServices[]>) => {
      state.selectedServices = action.payload;
      const calculateTotalPrice = (service: SelectedServices): number => {
        const subOptionsTotal =
          service.subOptions?.reduce(
            (total, subOption) => total + subOption.price,
            0
          ) || 0;
        const servicePrice = service.price * service.quantity;
        const totalPrice = servicePrice + subOptionsTotal;
        const discount = service.discount || 0;
        return totalPrice - discount;
      };
      const calculateTotalServicesPrice = (
        services: SelectedServices[]
      ): number => {
        return services.reduce(
          (total, service) => total + calculateTotalPrice(service),
          0
        );
      };
      state.totalPrice = calculateTotalServicesPrice(state.selectedServices);
    },
    addSelectedService: (
      state,
      action: PayloadAction<Omit<SelectedServices, 'id'>>
    ) => {
      const newService = {
        ...action.payload,
        id: uuidv4()
      };
      state.selectedServices.push(newService);
      state.totalPrice += newService.price;
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
    },
    setDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
    setAdditionalInfo: (state, action: PayloadAction<string>) => {
      state.additionalInfo = action.payload;
    }
  }
});

export const {
  addSelectedService,
  removeSelectedService,
  updateSelectedService,
  setTotalPrice,
  setSelectedServices,
  setDeliveryFee,
  setAdditionalInfo
} = serviceSelectionSlice.actions;

export const selectSelectedServices = (state: RootState) =>
  state.serviceSelection.selectedServices;
export const selectTotalPrice = (state: RootState) =>
  state.serviceSelection.totalPrice;
export const selectDeliveryFee = (state: RootState) =>
  state.serviceSelection.deliveryFee;
export const selectAdditionalInfo = (state: RootState) =>
  state.serviceSelection.additionalInfo;

export default serviceSelectionSlice.reducer;
