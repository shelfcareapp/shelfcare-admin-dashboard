import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Service {
  name: string;
  price: number;
}

interface SubOption {
  subOptionKey: string;
  name: string;
  price: number;
}

export const renderGroupedContent = (
  groupKeys: string[],
  servicesKeys: any,
  subOptionsKeys: any,
  namespace: string,
  expandedGroups: Record<string, boolean>,
  toggleGroup: (groupKey: string) => void,
  selectedServices: Record<string, any>,
  handleServiceToggle: (
    groupKey: string,
    serviceKey: string,
    serviceName: string,
    servicePrice: number
  ) => void,
  handleQuantityChange: (serviceKey: string, quantity: number) => void,
  handleDiscountChange: (serviceKey: string, discount: number) => void,
  t: any,
  handleAdditionalInfoChange: (serviceKey: string, value: string) => void
) => {
  return groupKeys.map((groupKey) => {
    const groupTitle = t(`${namespace}.groups.${groupKey}.title`);
    const isExpanded = expandedGroups[groupKey];

    return (
      <div
        key={groupKey}
        className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200 w-3/4 max-w-md mx-auto"
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
          {Object.keys(servicesKeys[groupKey]).map((serviceKey) => (
            <div key={serviceKey} className="py-2 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedServices[serviceKey]}
                    onChange={() =>
                      handleServiceToggle(
                        groupTitle,
                        serviceKey,
                        t(
                          `${namespace}.groups.${groupKey}.services.${serviceKey}.name`
                        ),
                        servicesKeys[groupKey][serviceKey].price
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
                <span>{servicesKeys[groupKey][serviceKey].price} €</span>
              </div>
              {selectedServices[serviceKey] && (
                <div className="flex flex-col justify-end py-2 items-end gap-2">
                  <div>
                    <span className="text-primary mr-4">{t('quantity')}</span>
                    <input
                      type="number"
                      min="1"
                      value={selectedServices[serviceKey]?.quantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          serviceKey,
                          parseInt(e.target.value)
                        )
                      }
                      className="p-1 w-16 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <span className="text-primary mr-4">{t('discount')}</span>
                    <input
                      type="number"
                      min="0"
                      value={selectedServices[serviceKey]?.discount || 0}
                      onChange={(e) =>
                        handleDiscountChange(
                          serviceKey,
                          parseInt(e.target.value)
                        )
                      }
                      className="p-1 w-16 border border-gray-300 rounded ml-4"
                      placeholder={t('discount')}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={selectedServices[serviceKey]?.additionalInfo || ''}
                      onChange={(e) =>
                        handleAdditionalInfoChange(serviceKey, e.target.value)
                      }
                      className="p-1 w-32 border border-gray-300 rounded ml-4"
                      placeholder={t('additional-info')}
                    />
                  </div>
                </div>
              )}
              {subOptionsKeys[serviceKey] &&
                subOptionsKeys[serviceKey].map((subOption) => (
                  <div
                    key={subOption.subOptionKey}
                    className="flex justify-between py-1 text-gray-600 ml-6 items-center"
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!selectedServices[subOption.subOptionKey]}
                        onChange={() =>
                          handleServiceToggle(
                            groupKey,
                            subOption.subOptionKey,
                            subOption.name,
                            subOption.price
                          )
                        }
                        className="mr-2"
                      />
                      <span>{subOption.name}</span>
                    </label>
                    <span>{subOption.price} €</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  });
};

export const renderLaundryContent = (
  laundryKeys: string[],
  laundrySubOptionsKeys: any,
  selectedServices: Record<string, any>,
  handleServiceToggle: (
    groupKey: string,
    serviceKey: string,
    serviceName: string,
    servicePrice: number
  ) => void,
  handleQuantityChange: (serviceKey: string, quantity: number) => void,
  t: any,
  handleAdditionalInfoChange: (serviceKey: string, value: string) => void,
  handleDiscountChange: (serviceKey: string, discount: number) => void
) => {
  return laundryKeys.map((serviceKey) => (
    <div
      key={serviceKey}
      className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200  w-3/4 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={!!selectedServices[serviceKey]}
            onChange={() =>
              handleServiceToggle(
                'laundry',
                serviceKey,
                t(`laundry.services.${serviceKey}.name`),
                t(`laundry.services.${serviceKey}.price`) as unknown as number
              )
            }
            className="mr-2"
          />
          <span>{t(`laundry.services.${serviceKey}.name`)}</span>
        </label>
        <span>{t(`laundry.services.${serviceKey}.price`)} €</span>
      </div>

      {selectedServices[serviceKey] && (
        <div className="flex justify-end py-2 items-center">
          <span className="text-primary mr-4">{t('quantity')}</span>
          <input
            type="number"
            min="1"
            value={selectedServices[serviceKey]?.quantity || 1}
            onChange={(e) =>
              handleQuantityChange(serviceKey, parseInt(e.target.value))
            }
            className="p-1 w-16 border border-gray-300 rounded"
          />
        </div>
      )}

      {laundrySubOptionsKeys[serviceKey] &&
        laundrySubOptionsKeys[serviceKey].map((subOption) => (
          <div
            key={subOption.subOptionKey}
            className="flex justify-between py-1 text-gray-600 ml-4"
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!!selectedServices[subOption.subOptionKey]}
                onChange={() =>
                  handleServiceToggle(
                    serviceKey,
                    subOption.subOptionKey,
                    subOption.name,
                    subOption.price
                  )
                }
                className="mr-2"
              />
              <span>{subOption.name}</span>
            </label>
            <span>{subOption.price} €</span>
          </div>
        ))}
    </div>
  ));
};
