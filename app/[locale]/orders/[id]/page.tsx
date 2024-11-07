'use client';

import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import ServiceSelection from 'components/new-order/ServiceSelection';
import OrderSummary from 'components/new-order/OrderSummary';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';

import {
  setSelectedServices,
  selectSelectedServices,
  selectTotalPrice
} from 'store/slices/service-selection-slice';
import {
  fetchOrderById,
  updateOrder
} from 'store/slices/order-selection-slice';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { DELIVERY_FEE } from '../../../../constants';

const OrderPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  const locale = useLocale();

  const [userId, setUserId] = useState<string>(null);
  const selectedServices = useAppSelector(selectSelectedServices);
  const totalPrice = useAppSelector(selectTotalPrice);

  const t = useTranslations('new-order');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id))
        .unwrap()
        .then((order) => {
          setUserId(order.customerId);
          dispatch(setSelectedServices(order.services));
        })
        .catch((error) => {
          toast.error('Failed to fetch order. Please try again.');
          console.error(error);
        });
    }
  }, [dispatch, id]);

  const handleNextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 3));
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
      <p>Palveluntarjoajamme ehdotti uusia palveluja. Tässä on päivitetty palvelusuunnitelmasi ja tietoa ehdotetuista palveluista:</p>
      <ol style="padding-left: 0; margin-top: 0;">${message}</ol>
      <p style="margin-top: 20px;">Palvelu- ja toimitusmaksu: <strong>€${DELIVERY_FEE}</strong></p>
      <p>Yhteensä: <strong>€${totalPrice}</strong></p>
      <p style="margin-top: 15px;">Jos haluat jatkaa ehdotetun palvelusuunnitelman mukaisesti, paina kyllä. Jos haluat pitäytyä alkuperäisessä palvelusuunnitelmassa, paina ei. Jos sinulla on kysyttävää päivitetystä palvelusuunnitelmasta, lähetä meille viesti!</p>
    </div>`
      : `<div>
      <p>Our services provider suggested new services. Here's your updated service plan and information about the suggested services:</p>
      <ol style="padding-left: 0; margin-top: 0;">${message}</ol>
      <p style="margin-top: 20px;">Service and delivery fee: <strong>€${DELIVERY_FEE}</strong></p>
      <p>Total: <strong>€${totalPrice}</strong></p>
      <p style="margin-top: 15px;">If you wish to proceed with the suggested service plan, press yes. If you want to stick to the original service plan, press no. If you have any questions regarding the updated service plan, send us a message!</p>
    </div>`;

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleUpdateOrder = async () => {
    try {
      await dispatch(
        updateOrder({
          id: id as string,
          selectedServices,
          totalPrice,
          message: finalMessage,
          userId
        })
      ).unwrap();

      router.push('/orders');
    } catch (error) {
      toast.error('Failed to update order. Please try again.');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div id="error-stepper" className="mb-12">
          <ul className="flex justify-between items-center w-full">
            {['Select Service', 'Review Order'].map((title, index) => (
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
            ))}
          </ul>
        </div>

        {/* Step Content */}
        <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
          {step === 1 && <ServiceSelection />}
          {step === 2 && selectedServices && userId && (
            <OrderSummary
              selectedServices={selectedServices}
              totalPrice={totalPrice}
              customer={{
                id: userId
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
          {step === 1 && (
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
          {step === 2 && (
            <button
              type="button"
              className="py-2 px-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition ease-in-out duration-200 flex items-center gap-2"
              onClick={handleUpdateOrder}
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

export default OrderPage;
