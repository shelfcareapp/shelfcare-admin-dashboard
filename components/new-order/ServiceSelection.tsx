'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  tailoringKeys,
  tailoringServicesKeys,
  tailoringSubOptionsKeys
} from './tailoringKeys';
import {
  cobblerKeys,
  cobblerServicesKeys,
  cobblerSubOptionsKeys
} from './cobblerKeys';
import { laundryKeys, laundrySubOptionsKeys } from './laundryKeys';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import {
  setSelectedServices,
  setTotalPrice
} from 'store/slices/service-selection-slice';

const ServiceSelection = () => {
  const t = useTranslations('pricing');
  const dispatch = useAppDispatch();
  const selectedServices = useAppSelector(
    (state) => state.serviceSelection.selectedServices
  );
  const totalPrice = useAppSelector(
    (state) => state.serviceSelection.totalPrice
  );
  const [activeTab, setActiveTab] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [customService, setCustomService] = useState({
    name: '',
    price: 0,
    parent: 'custom'
  });

  const handleCustomServiceChange = (e) => {
    setCustomService((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const getNamespace = () => {
    if (activeTab === 0) return 'tailoring';
    if (activeTab === 1) return 'cobbler';
    if (activeTab === 2) return 'laundry';
  };

  const handleServiceToggle = (
    parentCategory: string,
    serviceKey: string,
    serviceName: string,
    servicePrice: number
  ) => {
    const currentService = selectedServices[serviceKey];

    if (currentService) {
      const updatedServices = { ...selectedServices };
      delete updatedServices[serviceKey];

      const updatedTotalPrice =
        totalPrice -
        parseFloat(`${currentService.price}`) * currentService.quantity;

      dispatch(setTotalPrice(updatedTotalPrice));
      dispatch(setSelectedServices(updatedServices));
    } else {
      const updatedTotalPrice = totalPrice + parseFloat(`${servicePrice}`);

      dispatch(setTotalPrice(updatedTotalPrice));
      dispatch(
        setSelectedServices({
          ...selectedServices,
          [serviceKey]: {
            parent: parentCategory,
            price: parseFloat(`${servicePrice}`),
            quantity: 1,
            name: serviceName
          }
        })
      );
    }
  };

  const handleQuantityChange = (serviceKey: string, quantity: number) => {
    const currentService = selectedServices[serviceKey];
    if (currentService) {
      const updatedTotalPrice =
        totalPrice -
        currentService.price * currentService.quantity +
        currentService.price * quantity;

      dispatch(setTotalPrice(updatedTotalPrice));
      dispatch(
        setSelectedServices({
          ...selectedServices,
          [serviceKey]: { ...currentService, quantity }
        })
      );
    }
  };

  const handleAddToServices = () => {
    if (customService.name && customService.price > 0) {
      const serviceKey = `${customService.name}-${Date.now()}`;

      dispatch(
        setSelectedServices({
          ...selectedServices,
          [serviceKey]: {
            parent: 'custom',
            price: customService.price,
            quantity: 1,
            name: customService.name
          }
        })
      );
      dispatch(setTotalPrice(totalPrice + customService.price));

      setCustomService({ name: '', price: 0, parent: 'custom' });
    }
  };

  const renderGroupedContent = (
    groupKeys: string[],
    servicesKeys: unknown,
    subOptionsKeys: unknown
  ) => {
    const namespace = getNamespace();

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
            {servicesKeys[groupKey].map((serviceKey: string) => (
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
                {selectedServices[serviceKey] && (
                  <div className="flex justify-end py-2 items-center">
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
                )}
                {subOptionsKeys[serviceKey] &&
                  subOptionsKeys[serviceKey].map((subOptionKey: string) => (
                    <div
                      key={subOptionKey}
                      className="flex justify-between py-1 text-gray-600 ml-6 items-center"
                    >
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!selectedServices[subOptionKey]}
                          onChange={() =>
                            handleServiceToggle(
                              groupKey,
                              subOptionKey,
                              t(
                                `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                              ),
                              t(
                                `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                              ) as unknown as number
                            )
                          }
                          className="mr-2"
                        />
                        <span>
                          {t(
                            `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                          )}
                        </span>
                      </label>
                      <span>
                        {t(
                          `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                        )}{' '}
                        €
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderLaundryContent = () => {
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
          laundrySubOptionsKeys[serviceKey].map((subOptionKey) => (
            <div
              key={subOptionKey}
              className="flex justify-between py-1 text-gray-600 ml-4"
            >
              <span>
                {t(
                  `laundry.services.${serviceKey}.subOptions.${subOptionKey}.name`
                )}
              </span>
              <span>
                {t(
                  `laundry.services.${serviceKey}.subOptions.${subOptionKey}.price`
                )}
                €
              </span>
            </div>
          ))}
      </div>
    ));
  };

  const renderActiveTabContent = () => {
    if (activeTab === 0) {
      return renderGroupedContent(
        tailoringKeys,
        tailoringServicesKeys,
        tailoringSubOptionsKeys
      );
    } else if (activeTab === 1) {
      return renderGroupedContent(
        cobblerKeys,
        cobblerServicesKeys,
        cobblerSubOptionsKeys
      );
    } else if (activeTab === 2) {
      return renderLaundryContent(); // Use custom renderer for laundry services
    }
  };

  return (
    <div>
      <div className="tabs mb-12 flex justify-center space-x-4">
        {['0', '1', '2'].map((category, index) => (
          <button
            key={index}
            className={`py-2 px-6 rounded-full font-medium transition-all ${
              activeTab === index
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'bg-gray-200 text-primary hover:bg-primary hover:text-white hover:shadow-md'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {t(`categories.${category}`)}
          </button>
        ))}
      </div>

      {/* Render active service tab */}
      <div>{renderActiveTabContent()}</div>

      {/* Custom service section */}
      <div className="mt-8 w-3/4 max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-4">{t('custom-service')}</h3>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder={t('custom-service')}
            className="p-2 border border-gray-300 rounded w-2/3"
            name="name"
            value={customService.name}
            onChange={handleCustomServiceChange}
          />
          <input
            type="number"
            placeholder={t('price')}
            className="p-2 border border-gray-300 rounded w-1/4 ml-4"
            name="price"
            value={customService.price}
            onChange={handleCustomServiceChange}
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded ml-4"
            onClick={handleAddToServices}
          >
            {t('add')}
          </button>
        </div>
      </div>

      {/* Display added custom services */}
      <div className="mt-4 w-3/4 max-w-md mx-auto">
        {Object.keys(selectedServices).map((key) => {
          const service = selectedServices[key];
          if (service.parent === 'custom') {
            return (
              <div key={key} className="flex justify-between items-center">
                <span>{service.name}</span>
                <span>{service.price} €</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ServiceSelection;
