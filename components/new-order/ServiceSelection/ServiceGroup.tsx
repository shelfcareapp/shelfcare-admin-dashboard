import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAppDispatch } from 'hooks/use-store';
import { addSelectedService } from 'store/slices/service-selection-slice';
import { useTranslations } from 'next-intl';

const ServiceGroup = ({
  groupKeys,
  servicesKeys,
  subOptionsKeys,
  namespace,
  expandedGroups,
  toggleGroup
}) => {
  const t = useTranslations('pricing');
  const dispatch = useAppDispatch();

  const [tempSelectedServices, setTempSelectedServices] = useState({});

  const handleServiceToggle = (serviceKey, serviceName, servicePrice) => {
    setTempSelectedServices((prev) => {
      const updatedServices = { ...prev };
      if (updatedServices[serviceKey]) {
        delete updatedServices[serviceKey];
      } else {
        updatedServices[serviceKey] = {
          parent: namespace,
          name: serviceName,
          price: servicePrice,
          quantity: 1,
          subOptions: []
        };
      }
      return updatedServices;
    });
  };

  const handleSubOptionChange = (e, serviceKey, subOptionKey, price, name) => {
    const isChecked = e.target.checked;

    setTempSelectedServices((prev) => {
      const currentService = prev[serviceKey] || {};
      const currentSubOptions = currentService.subOptions || [];

      const updatedSubOptions = isChecked
        ? [...currentSubOptions, { key: subOptionKey, price, name }]
        : currentSubOptions.filter((option) => option.key !== subOptionKey);

      return {
        ...prev,
        [serviceKey]: {
          ...currentService,
          subOptions: updatedSubOptions
        }
      };
    });
  };

  const handleAddToServices = () => {
    Object.keys(tempSelectedServices).forEach((serviceKey) => {
      const service = tempSelectedServices[serviceKey];
      const subOptionsPrice = service.subOptions.reduce(
        (acc, option) => acc + Number(option.price),
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
          subOptions: service.subOptions,
          discount: service.discount || 0,
          additionalInfo: service.additionalInfo || ''
        })
      );
    });

    setTempSelectedServices({});
  };

  return groupKeys.map((groupKey) => {
    const groupTitle = t(`${namespace.toLowerCase()}.groups.${groupKey}.title`);
    const isExpanded = expandedGroups[groupKey];

    return (
      <div
        key={groupKey}
        className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200 max-w-lg mx-auto"
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleGroup(groupKey)}
        >
          <h3 className="text-xl font-semibold text-primary">{groupTitle}</h3>
          {isExpanded ? (
            <FaChevronUp className="text-primary" />
          ) : (
            <FaChevronDown className="text-primary" />
          )}
        </div>
        <div
          className={`mt-4 transition-max-height duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          {servicesKeys[groupKey] &&
            servicesKeys[groupKey].map((serviceKey) => (
              <div key={serviceKey} className="py-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!tempSelectedServices[serviceKey]}
                      onChange={() =>
                        handleServiceToggle(
                          serviceKey,
                          t(
                            `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.name`
                          ),
                          t(
                            `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.price`
                          ) as unknown as number
                        )
                      }
                      className="mr-2"
                    />
                    <span>
                      {t(
                        `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.name`
                      )}
                    </span>
                  </label>
                  <span>
                    {t(
                      `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.price`
                    )}{' '}
                    €
                  </span>
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
                          setTempSelectedServices((prev) => ({
                            ...prev,
                            [serviceKey]: {
                              ...prev[serviceKey],
                              quantity: parseInt(e.target.value)
                            }
                          }))
                        }
                        className="p-1 w-16 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="flex justify-end py-2 items-center">
                      <span className="text-primary mr-4">{t('discount')}</span>
                      <input
                        type="number"
                        min="0"
                        value={tempSelectedServices[serviceKey]?.discount || 0}
                        onChange={(e) =>
                          setTempSelectedServices((prev) => ({
                            ...prev,
                            [serviceKey]: {
                              ...prev[serviceKey],
                              discount: parseInt(e.target.value)
                            }
                          }))
                        }
                        className="p-1 w-16 border border-gray-300 rounded"
                      />
                    </div>
                    {subOptionsKeys[serviceKey] &&
                      subOptionsKeys[serviceKey].map((subOptionKey) => {
                        const name = t(
                          `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                        );
                        const price = Number(
                          t(
                            `${namespace.toLowerCase()}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                          )
                        );

                        return (
                          <label
                            key={subOptionKey}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={tempSelectedServices[
                                serviceKey
                              ]?.subOptions.some(
                                (option) => option.key === subOptionKey
                              )}
                              onChange={(e) =>
                                handleSubOptionChange(
                                  e,
                                  serviceKey,
                                  subOptionKey,
                                  price,
                                  name
                                )
                              }
                            />
                            <span>
                              {name} - +{price} €
                            </span>
                          </label>
                        );
                      })}

                    <textarea
                      placeholder={t('additional-info')}
                      className="border border-gray-300 rounded p-2"
                      value={
                        tempSelectedServices[serviceKey]?.additionalInfo || ''
                      }
                      onChange={(e) =>
                        setTempSelectedServices((prev) => ({
                          ...prev,
                          [serviceKey]: {
                            ...prev[serviceKey],
                            additionalInfo: e.target.value
                          }
                        }))
                      }
                    />

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
      </div>
    );
  });
};

export default ServiceGroup;
