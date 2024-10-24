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
  const [selectedSubOption, setSelectedSubOption] = useState('');

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
          parent: namespace,
          name: serviceName,
          price: servicePrice,
          quantity: 1,
          subOptions: []
        }
      });
    }
  };

  const handleSubOptionChange = (e) => {
    const selectedSubOption = e.target.value;
    setSelectedSubOption(selectedSubOption);
  };

  const handleAddToServices = () => {
    Object.keys(tempSelectedServices).forEach((serviceKey) => {
      const subOptions = tempSelectedServices[serviceKey];
      const subOptionsPrice = subOptions.subOptions.reduce(
        (acc, subOption) => Number(acc) + Number(subOption.price),
        0
      );

      const service = tempSelectedServices[serviceKey];

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

  return groupKeys.map((groupKey) => {
    const groupTitle = t(`${namespace}.groups.${groupKey}.title`);
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
                            `${namespace}.groups.${groupKey}.services.${serviceKey}.name`
                          ),
                          t(
                            `${namespace}.groups.${groupKey}.services.${serviceKey}.price`
                          ) as unknown as number
                        )
                      }
                      className="mr-2"
                    />
                    <span>
                      {t(
                        `${namespace}.groups.${groupKey}.services.${serviceKey}.name`
                      )}
                    </span>
                  </label>
                  <span>
                    {t(
                      `${namespace}.groups.${groupKey}.services.${serviceKey}.price`
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
                    {subOptionsKeys[serviceKey] && (
                      <select
                        className="p-2 border border-gray-300 rounded mt-2"
                        onChange={handleSubOptionChange}
                        value={selectedSubOption}
                      >
                        <option value="" disabled>
                          {t('select-sub-options')}
                        </option>
                        {subOptionsKeys[serviceKey].map((subOptionKey) => {
                          const name = t(
                            `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                          );
                          const price = Number(
                            t(
                              `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                            )
                          );
                          const value = `${name} - ${price} €`;
                          return (
                            <option key={subOptionKey} value={value}>
                              {t(
                                `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                              )}{' '}
                              -{' '}
                              {t(
                                `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                              )}{' '}
                            </option>
                          );
                        })}
                      </select>
                    )}

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
