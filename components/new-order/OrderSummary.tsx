'use client';

import { useAppDispatch } from 'hooks/use-store';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'react-toastify';
import { sendMessage } from 'store/slices/chats-slice';
import { SelectedServices } from 'types';

interface OrderSummaryProps {
  selectedServices: SelectedServices;
  totalPrice: number;
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
    entranceInfo: string;
    phone: string;
    postalCode: string;
  };
  onConfirmOrder: (pickupDate: Date, returnDate: Date) => void;
  onBackClick: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedServices,
  totalPrice,
  customer,
  onBackClick
}) => {
  const dispatch = useAppDispatch();
  const deliveryFee = 10;
  const t = useTranslations('order-review');
  const tNewOrder = useTranslations('new-order');

  const calculateTotalPayable = () => {
    const subtotal = totalPrice;
    const totalPayable = subtotal + deliveryFee;
    return Math.round(totalPayable * 100) / 100;
  };

  const selectedServicesArray = Object.keys(selectedServices);

  // Generate the receipt message
  const generateReceiptMessage = () => {
    let message = `Order Summary for ${customer.name}:\n\n`;
    message += `Customer Info:\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nAddress: ${customer.address}\n\n`;
    message += `Services:\n`;

    selectedServicesArray.forEach((serviceKey) => {
      const service = selectedServices[serviceKey];
      message += `\n- ${service.name} x ${service.quantity}, ${(
        service.price * service.quantity
      ).toFixed(2)} €`;
      if (service.additionalInfo) {
        message += `\n  Info: ${service.additionalInfo}`;
      }
      if (service.subOptions && service.subOptions.length > 0) {
        message += `\n  SubOptions: ${service.subOptions
          .map((subOption) => `${subOption.name} (${subOption.price} €)`)
          .join(', ')}`;
      }
    });

    message += `\n\nSubtotal: ${totalPrice.toFixed(2)} €`;
    message += `\nDelivery Fee: ${deliveryFee.toFixed(2)} €`;
    message += `\nTotal Payable: ${calculateTotalPayable()} €`;

    message += `\n\nPlease confirm your pickup and return time.`;
    return message;
  };

  const handleSendMessage = () => {
    const message = generateReceiptMessage();
    if (!message.trim()) return;
    const images = [];
    const sender = 'admin-order-confirmation';
    dispatch(
      sendMessage({
        selectedUserId: customer.id,
        message,
        images,
        sender
      })
    );

    toast.success('Order sent successfully!');
  };

  return (
    <>
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
              {selectedServicesArray.length > 0 ? (
                selectedServicesArray.map((serviceKey) => (
                  <tr key={serviceKey} className="border-b">
                    <td className="py-4">
                      <p className="font-medium">
                        {selectedServices[serviceKey].name}
                      </p>
                      {selectedServices[serviceKey].additionalInfo && (
                        <p className="text-sm text-gray-500">
                          Info: {selectedServices[serviceKey].additionalInfo}
                        </p>
                      )}
                      {selectedServices[serviceKey].subOptions &&
                        selectedServices[serviceKey].subOptions.length > 0 && (
                          <ul className="list-disc ml-6">
                            {selectedServices[serviceKey].subOptions.map(
                              (subOption) => (
                                <li key={subOption.key}>
                                  {subOption.name} - {subOption.price} €
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </td>
                    <td className="text-center py-4">
                      {selectedServices[serviceKey].quantity}
                    </td>
                    <td className="text-right py-4">
                      {(
                        selectedServices[serviceKey].price *
                        selectedServices[serviceKey].quantity
                      ).toFixed(2)}{' '}
                      €
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    {t('no-services-selected')}
                  </td>
                </tr>
              )}
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

          <div className="flex justify-between text-lg font-semibold mt-4">
            <p>{t('total')}</p>
            <p>{calculateTotalPayable()} €</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        <button
          className="bg-gray-200 text-gray-900 px-4 py-2 rounded mb-2 hover:bg-gray-300"
          onClick={onBackClick}
        >
          {tNewOrder('back')}
        </button>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleSendMessage}
        >
          Send Order
        </button>
      </div>
    </>
  );
};

export default OrderSummary;
