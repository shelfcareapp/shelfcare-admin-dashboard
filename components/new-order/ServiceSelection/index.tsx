'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  tailoringKeys,
  tailoringServicesKeys,
  tailoringSubOptionsKeys
} from '../tailoringKeys';
import {
  cobblerKeys,
  cobblerServicesKeys,
  cobblerSubOptionsKeys
} from '../cobblerKeys';
import { laundryKeys, laundrySubOptionsKeys } from '../laundryKeys';
import { useAppSelector } from 'hooks/use-store';

import ServiceGroup from './ServiceGroup';
import LaundryGroup from './LaundryGroup';
import CustomServiceForm from './CustomServiceForm';
import ServiceList from './ServiceList';

const ServiceSelection = () => {
  const t = useTranslations('pricing');

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

  const renderActiveTabContent = () => {
    const namespace = getNamespace();

    if (activeTab === 0) {
      return (
        <ServiceGroup
          groupKeys={tailoringKeys}
          servicesKeys={tailoringServicesKeys}
          subOptionsKeys={tailoringSubOptionsKeys}
          namespace={namespace}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      );
    } else if (activeTab === 1) {
      return (
        <ServiceGroup
          groupKeys={cobblerKeys}
          servicesKeys={cobblerServicesKeys}
          subOptionsKeys={cobblerSubOptionsKeys}
          namespace={namespace}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      );
    } else if (activeTab === 2) {
      return (
        <LaundryGroup
          laundryKeys={laundryKeys}
          laundrySubOptionsKeys={laundrySubOptionsKeys}
        />
      );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="w-[70%]">
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

          <div>{renderActiveTabContent()}</div>
          <CustomServiceForm
            customService={customService}
            setCustomService={setCustomService}
            totalPrice={totalPrice}
          />
        </div>

        <ServiceList />
      </div>
    </div>
  );
};

export default ServiceSelection;
