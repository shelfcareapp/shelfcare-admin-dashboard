'use client';
import React from 'react';

import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import ServiceSelection from 'components/new-order/ServiceSelection';
import UserSelection from 'components/new-order/UserSelection';
import OrderSummary from 'components/new-order/OrderSummary';
import { useLocale, useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import {
  setSelectedUser,
  selectSelectedUser
} from 'store/slices/user-selection-slice';
import {
  selectSelectedServices,
  selectTotalPrice
} from 'store/slices/service-selection-slice';
import { fetchNonAdminUsers, selectUsers } from 'store/slices/users-slice';
import { createOrder } from 'store/slices/order-selection-slice';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { DELIVERY_FEE } from '../../../constants';
import { useRouter } from 'next/navigation';

const NewOrderPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const selectedUser = useAppSelector(selectSelectedUser);
  const selectedServices = useAppSelector(selectSelectedServices);
  const totalPrice = useAppSelector(selectTotalPrice);
  const users = useAppSelector(selectUsers);

  const t = useTranslations('new-order');

  useEffect(() => {
    dispatch(fetchNonAdminUsers());
  }, [dispatch]);

  const handleNextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const message = selectedServices
    .map((service, index) => {
      const subOptionsText = service.subOptions?.length
        ? `<div style="margin-top: 4px;">
          <strong>${
            locale === 'fi' ? 'Lisävalinnat' : 'Additional options'
          }:</strong> ${service.subOptions
            .map((opt) => `${opt.key} (+${opt.price} €)`)
            .join(', ')}
        </div>`
        : '';

      const additionalInfoText = service.additionalInfo
        ? `<div style="margin-top: 4px;">
          <strong>${
            locale === 'fi' ? 'Lisätiedot' : 'Additional information'
          }:</strong> ${service.additionalInfo}
        </div>`
        : '';

      const discountText = service.discount
        ? `<div style="margin-top: 4px;">
          <strong>${locale === 'fi' ? 'Alennus' : 'Discount'}:</strong> ${
            service.discount
          }%
        </div>`
        : '';

      return `
    <li style="list-style-type: none; padding: 12px; margin-bottom: 10px; border-bottom: 1px solid #ddd;">
      <div><strong>${index + 1}. ${service.name}</strong> - €${
        service.price
      }</div>
      ${subOptionsText}
      ${additionalInfoText}
      ${discountText}
    </li>`;
    })
    .join('');

  const finalMessage =
    locale === 'fi'
      ? `<div style="margin-bottom: 10px">
        <p>Tässä on palvelusuunnitelmasi:</p>
        <ol style="padding-left: 0; margin-top: 0;">${message}</ol>
        <p style="margin-top: 20px;">Palvelu- ja toimitusmaksu: <strong>€${DELIVERY_FEE}</strong></p>
        <p>Yhteensä: <strong>€${totalPrice}</strong></p>
        <p style="margin-top: 15px;">Valitse nouto- ja palautusajat:</p>
      </div>`
      : `<div>
        <p>Here is your service plan:</p>
        <ol style="padding-left: 0; margin-top: 0;">${message}</ol>
        <p style="margin-top: 20px;">Service and delivery fee: <strong>€${DELIVERY_FEE}</strong></p>
        <p>Total: <strong>€${totalPrice}</strong></p>
        <p style="margin-top: 15px;">Please select a pickup and delivery time:</p>
      </div>`;

  const handleConfirmOrder = async () => {
    try {
      await dispatch(
        createOrder({
          selectedUser,
          selectedServices,
          totalPrice,
          message: finalMessage
        })
      ).unwrap();

      router.push('/orders');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div id="error-stepper" className="mb-12">
          <ul className="flex justify-between items-center w-full">
            {['Select User', 'Select Service', 'Review Order'].map(
              (title, index) => (
                <li key={index} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index + 1 < step
                        ? 'bg-green-500 text-white'
                        : index + 1 === step
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-gray-200 text-gray-500'
                    } shadow-md`}
                  >
                    {index + 1 < step ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="ml-3 text-base font-medium text-gray-700">
                    {title}
                  </span>
                  {index < 2 && (
                    <div
                      className={`h-[1px] flex-grow mx-4 ${
                        index + 1 < step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Step Content */}
        <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
          {step === 1 && (
            <UserSelection
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={(user) => dispatch(setSelectedUser(user))}
            />
          )}
          {step === 2 && <ServiceSelection />}
          {step === 3 && selectedUser && (
            <OrderSummary
              selectedServices={selectedServices}
              totalPrice={totalPrice}
              customer={{
                id: selectedUser.id
              }}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between items-center gap-4">
          {step > 1 && (
            <button
              type="button"
              className="py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition ease-in-out duration-200 flex items-center gap-2"
              onClick={handlePreviousStep}
            >
              <FiArrowLeft />
              <span>{t('back')}</span>
            </button>
          )}
          {step < 3 && (
            <div className="flex items-center justify-end w-full">
              <button
                type="button"
                className="py-2 px-4 bg-primary text-white rounded-lg shadow-lg hover:opacity-70 transition ease-in-out duration-200 flex items-center gap-2"
                onClick={handleNextStep}
              >
                <span>{t('next')}</span>
                <FiArrowRight />
              </button>
            </div>
          )}
          {step === 3 && (
            <button
              type="button"
              className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition ease-in-out duration-200 flex items-center gap-2"
              onClick={handleConfirmOrder}
            >
              <span>{t('confirm-order')}</span>
              <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewOrderPage;
