export const calculateTotalPrice = (
  totalPrice: number,
  deliveryFee: number
) => {
  const totalPayable = totalPrice + deliveryFee;
  return Math.round(totalPayable * 100) / 100;
};
