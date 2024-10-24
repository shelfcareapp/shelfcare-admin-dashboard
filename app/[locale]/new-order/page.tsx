'use client';

import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import ServiceSelection from 'components/new-order/ServiceSelection';
import UserSelection from 'components/new-order/UserSelection';
import OrderSummary from 'components/new-order/OrderSummary';
import { useTranslations } from 'next-intl';
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
import { toast } from 'react-toastify';

const NewOrderPage = () => {
  const [step, setStep] = useState(1);
  const [discount, setDiscount] = useState(0);
  const dispatch = useAppDispatch();

  const selectedUser = useAppSelector(selectSelectedUser);
  const selectedServices = useAppSelector(selectSelectedServices);
  const totalPrice = useAppSelector(selectTotalPrice);
  const users = useAppSelector(selectUsers);

  const t = useTranslations('new-order');

  useEffect(() => {
    dispatch(fetchNonAdminUsers());
  }, [dispatch]);

  const handleConfirmOrder = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first.');
      return;
    }

    dispatch(createOrder({ selectedUser, selectedServices, totalPrice })).then(
      () => {
        setStep(1);
      }
    );
  };

  return (
    <Layout title={t('title')}>
      <div className="container mx-auto py-6">
        {step === 1 && (
          <UserSelection
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={(user) => dispatch(setSelectedUser(user))}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <div>
            <h1 className="text-3xl mb-6">{t('select-service')}</h1>
            <ServiceSelection />
            <div className="mt-6 flex items-center justify-between">
              <button
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => setStep(3)}
              >
                {t('next-review')}
              </button>
            </div>
          </div>
        )}
        {step === 3 && selectedUser && (
          <OrderSummary
            selectedServices={selectedServices}
            totalPrice={totalPrice}
            customer={{
              id: selectedUser.id,
              name: selectedUser.name,
              email: selectedUser.email,
              address: selectedUser.address,
              entranceInfo: selectedUser.entranceInfo,
              phone: selectedUser.phone,
              postalCode: selectedUser.postalCode
            }}
            onConfirmOrder={handleConfirmOrder}
            onBackClick={() => setStep(2)}
          />
        )}
      </div>
    </Layout>
  );
};

export default NewOrderPage;
