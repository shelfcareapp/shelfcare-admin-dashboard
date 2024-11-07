import {SelectedServices} from 'types';

export const calculateTotalPrice = (
  selectedServices: SelectedServices[],
  discount: number
) => {
  const totalPrice = Object.values(selectedServices).reduce(
    (acc: number, service: any) => acc + service.price * service.quantity,
    0
  );

  discount = discount || 0;
  const discountAmount = Number(totalPrice) * (discount / 100);
  return Number(totalPrice) - discountAmount + 10;
};

