import React from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import { removeSelectedService } from 'store/slices/service-selection-slice';
import { useTranslations } from 'next-intl';

const ServiceList = () => {
  const t = useTranslations('pricing');
  const selectedServices = useAppSelector(
    (state) => state.serviceSelection.selectedServices
  );
  const dispatch = useAppDispatch();

  const groupedServices = Object.keys(selectedServices).reduce(
    (acc, key) => {
      const service = selectedServices[key];
      const parentGroup = service.parent.toLowerCase();
      if (!acc[parentGroup]) {
        acc[parentGroup] = [];
      }
      acc[parentGroup].push(service);
      return acc;
    },
    { tailoring: [], cobbler: [], laundry: [], custom: [] }
  );

  return (
    <div className="bg-slate-50 p-4 flex flex-col items-start overflow-y-scroll">
      <h3 className="text-lg font-semibold mb-4">Selected Services</h3>

      {Object.entries(groupedServices).map(([groupKey, services]) => (
        <div key={groupKey} className="mb-6">
          <h4 className="text-md font-bold mb-2 capitalize">{groupKey}</h4>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-2  mb-2 text-sm"
              >
                <div className="flex flex-col gap-2 items-start">
                  <span>
                    <b>{t('service-name')}</b>: {service.name}
                  </span>

                  <span>
                    <b>{t('additional-info')}</b>: {service.additionalInfo}
                  </span>
                </div>
                <span>
                  <b>{t('quantity')}</b>:{' '}
                  {typeof service.quantity === 'number' ? service.quantity : 0}
                </span>
                {service.subOptions && service.subOptions.length > 0 ? (
                  <div className="flex flex-col gap-1 items-start">
                    <span>
                      <b>{t('sub-options')}</b>
                    </span>
                    {service.subOptions.map((subOption, index) => {
                      return (
                        <span key={index}>
                          {subOption.key}:{' '}
                          {subOption.price ? `${subOption.price} €` : 'N/A'}
                        </span>
                      );
                    })}
                  </div>
                ) : null}

                <span>
                  <b>{t('price')}</b>:{' '}
                  {typeof service.price === 'number'
                    ? service.price.toFixed(2)
                    : '0.00'}{' '}
                  €
                </span>
                <button
                  onClick={() => dispatch(removeSelectedService(service.id))}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  {t('remove')}
                </button>
                <div className="border-b-2 border-gray-300 w-full mt-2"></div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No services selected</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
