'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { SelectedServices } from 'types';

interface OrderSummaryProps {
  selectedServices: SelectedServices;
  totalPrice: number;
  discount: number;
  setDiscount: (discount: number) => void;
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
    entranceInfo: string;
    phone: string;
    postalCode: string;
  };
  onConfirmOrder: () => void;
  onBackClick: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedServices,
  totalPrice,
  discount,
  setDiscount,
  customer,
  onBackClick,
  onConfirmOrder
}) => {
  const deliveryFee = 10;
  const t = useTranslations('order-review');
  const tNewOrder = useTranslations('new-order');

  const calculateTotalPayable = () => {
    const subtotal = totalPrice;
    const discountAmount = subtotal * (discount / 100);
    const totalPayable = subtotal - discountAmount + deliveryFee;
    return Math.round(totalPayable * 100) / 100;
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <button
          className="bg-gray-200 text-gray-900 px-4 py-2 rounded mb-2 hover:bg-gray-300"
          onClick={onBackClick}
        >
          {tNewOrder('back')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 bg-white rounded shadow">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4">
            {t('order')} #{customer.id}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {new Date().toLocaleDateString()} at{' '}
            {new Date().toLocaleTimeString()}
          </p>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">{t('service-details')}</th>
                <th className="text-center py-2">{t('quantity')}</th>
                <th className="text-right py-2">{t('price')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(selectedServices).map((service) => (
                <tr key={service} className="border-b">
                  <td className="py-4">
                    <p className="font-medium">
                      {selectedServices[service].name}
                    </p>
                  </td>
                  <td className="text-center py-4">
                    {selectedServices[service].quantity}
                  </td>
                  <td className="text-right py-4">
                    {selectedServices[service].price.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between text-sm font-medium">
            <p>{t('subtotal')}</p>
            <p>{totalPrice.toFixed(2)} €</p>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <p>{t('delivery-service-fees')}</p>
            <p>{deliveryFee.toFixed(2)} €</p>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <p>{t('discount')}</p>
            <input
              type="number"
              value={discount}
              min="0"
              max="100"
              onChange={(e) => {
                const discountValue = parseFloat(e.target.value);
                setDiscount(isNaN(discountValue) ? 0 : discountValue);
              }}
              className="border border-gray-300 rounded p-1 w-16 text-right"
            />
          </div>
          <div className="flex justify-between text-lg font-semibold mt-4">
            <p>{t('total')}</p>
            <p>{calculateTotalPayable()} €</p>
          </div>
        </div>

        {/* Right section - Customer Info */}
        <div className="bg-gray-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">{t('customer')}</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">{t('address')}</p>
              <p>{customer.address}</p>
              <p>{customer.phone}</p>
              <p>{customer.entranceInfo}</p>
              <p>{customer.postalCode}</p>
            </div>
            <div>
              <p className="font-semibold">{t('email')}</p>
              <p>{customer.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="bg-primary text-white font-semibold py-3 px-6 rounded w-full hover:bg-primary-dark"
              onClick={onConfirmOrder}
            >
              {t('save-order')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
