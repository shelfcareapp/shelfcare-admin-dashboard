import React, { useState } from 'react';
import { useAppDispatch } from 'hooks/use-store';
import { addSelectedService } from 'store/slices/service-selection-slice';
import { useTranslations } from 'next-intl';

const LaundryGroup = ({ laundryKeys, laundrySubOptionsKeys }) => {
  const t = useTranslations('pricing');
  const dispatch = useAppDispatch();

  const [tempSelectedServices, setTempSelectedServices] = useState({});

  const handleServiceToggle = (serviceKey, serviceName, servicePrice) => {
    const currentService = tempSelectedServices[serviceKey];

    if (currentService) {
      const updatedServices = { ...tempSelectedServices };
      delete updatedServices[serviceKey];
      setTempSelectedServices(updatedServices);
    } else {
      setTempSelectedServices({
        ...tempSelectedServices,
        [serviceKey]: {
          parent: 'laundry',
          name: serviceName,
          price: servicePrice,
          quantity: 1,
          subOptions: []
        }
      });
    }
  };

  console.log(tempSelectedServices);

  const handleAddToServices = () => {
    Object.keys(tempSelectedServices).forEach((serviceKey) => {
      const service = tempSelectedServices[serviceKey];
      const subOptions = tempSelectedServices[serviceKey];
      const subOptionsPrice = subOptions.subOptions.reduce(
        (acc, subOption) => Number(acc) + Number(subOption.price),
        0
      );

      const discountedPrice =
        (Number(service.price) + subOptionsPrice) *
        (1 - (service.discount || 0) / 100);
      const totalPrice = discountedPrice * service.quantity;
      dispatch(
        addSelectedService({
          parent: service.parent,
          name: service.name,
          price: totalPrice,
          quantity: service.quantity,
          subOptions: service.subOptions || [],
          discount: service.discount || 0,
          additionalInfo: service.additionalInfo || ''
        })
      );
    });

    setTempSelectedServices({});
  };

  return (
    <div>
      {laundryKeys.map((serviceKey) => (
        <div
          key={serviceKey}
          className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200 max-w-md mx-auto"
        >
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!tempSelectedServices[serviceKey]}
                onChange={() =>
                  handleServiceToggle(
                    serviceKey,
                    t(`laundry.services.${serviceKey}.name`),
                    t(
                      `laundry.services.${serviceKey}.price`
                    ) as unknown as number
                  )
                }
                className="mr-2"
              />
              <span>{t(`laundry.services.${serviceKey}.name`)}</span>
            </label>
            <span>{t(`laundry.services.${serviceKey}.price`)} €</span>
          </div>

          {tempSelectedServices[serviceKey] && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-end py-2 items-center">
                <span className="text-primary mr-4">{t('quantity')}</span>
                <input
                  type="number"
                  min="1"
                  value={tempSelectedServices[serviceKey]?.quantity || 1}
                  onChange={(e) =>
                    setTempSelectedServices({
                      ...tempSelectedServices,
                      [serviceKey]: {
                        ...tempSelectedServices[serviceKey],
                        quantity: parseInt(e.target.value)
                      }
                    })
                  }
                  className="p-1 w-16 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end py-2 items-center">
                <span className="text-primary mr-4">{t('discount')}</span>
                <input
                  type="number"
                  min="1"
                  value={tempSelectedServices[serviceKey]?.discount || 0}
                  onChange={(e) =>
                    setTempSelectedServices({
                      ...tempSelectedServices,
                      [serviceKey]: {
                        ...tempSelectedServices[serviceKey],
                        discount: parseInt(e.target.value)
                      }
                    })
                  }
                  className="p-1 w-16 border border-gray-300 rounded"
                />
              </div>

              {laundrySubOptionsKeys[serviceKey] &&
                laundrySubOptionsKeys[serviceKey].map((subOptionKey) => {
                  const subOptionName = t(
                    `laundry.services.${serviceKey}.subOptions.${subOptionKey}.name`
                  );
                  const subOptionPrice = t(
                    `laundry.services.${serviceKey}.subOptions.${subOptionKey}.price`
                  ) as unknown as number;
                  const isSubOptionSelected = tempSelectedServices[
                    serviceKey
                  ]?.subOptions?.find((option) => option.key === subOptionKey);

                  return (
                    <div
                      key={subOptionKey}
                      className="flex justify-between py-1 text-gray-600 ml-4"
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!isSubOptionSelected}
                          onChange={() => {
                            const currentSubOptions =
                              tempSelectedServices[serviceKey]?.subOptions ||
                              [];
                            const updatedSubOptions = isSubOptionSelected
                              ? currentSubOptions.filter(
                                  (option) => option.key !== subOptionKey
                                )
                              : [
                                  ...currentSubOptions,
                                  {
                                    key: subOptionKey,
                                    name: subOptionName,
                                    price: subOptionPrice
                                  }
                                ];

                            setTempSelectedServices({
                              ...tempSelectedServices,
                              [serviceKey]: {
                                ...tempSelectedServices[serviceKey],
                                subOptions: updatedSubOptions
                              }
                            });
                          }}
                          className="mr-2"
                        />
                        <span>{subOptionName}</span>
                      </label>
                      <span>{subOptionPrice} €</span>
                    </div>
                  );
                })}

              <button
                className="bg-primary text-white px-4 py-2 rounded mt-4"
                onClick={handleAddToServices}
              >
                {t('add-service')}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LaundryGroup;
