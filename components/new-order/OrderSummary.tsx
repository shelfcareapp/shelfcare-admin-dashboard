'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { Customer, SelectedServices } from 'types';
import { DELIVERY_FEE } from '../../constants';

interface OrderSummaryProps {
  selectedServices: SelectedServices[];
  totalPrice: number;
  customer: Pick<Customer, 'id'>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedServices,
  totalPrice,
  customer
}) => {
  const t = useTranslations('order-review');

  const calculateTotalPayable = () => {
    const totalPayable = totalPrice + DELIVERY_FEE;
    return Math.round(totalPayable * 100) / 100;
  };

  const selectedServicesArray = Object.keys(selectedServices);

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
                                  {subOption.key} - {subOption.price} €
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
                      {selectedServices[serviceKey].price.toFixed(2)} €
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
            <p>{DELIVERY_FEE.toFixed(2)} €</p>
          </div>

          <div className="flex justify-between text-lg font-semibold mt-4">
            <p>{t('total')}</p>
            <p>{calculateTotalPayable()} €</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
