import React from 'react';

const ServiceList = ({ selectedServices }) => {
  const groupedServices = Object.keys(selectedServices).reduce(
    (acc, key) => {
      const service = selectedServices[key];
      const parentGroup = service.parent;
      if (!acc[parentGroup]) {
        acc[parentGroup] = [];
      }
      acc[parentGroup].push(service);
      return acc;
    },
    { tailoring: [], cobbler: [], laundry: [], custom: [] }
  );

  return (
    <div className="bg-slate-50 p-4 flex flex-col items-start w-1/4">
      <h3 className="text-lg font-semibold mb-4">Selected Services</h3>

      {Object.entries(groupedServices).map(([groupKey, services]) => (
        <div key={groupKey} className="mb-6">
          <h4 className="text-md font-bold mb-2 capitalize">{groupKey}</h4>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={index}
                className="flex justify-between gap-2 items-center mb-2 text-sm"
              >
                <span>{service.name} </span>
                <span>{' - '}</span>
                <span>
                  {' '}
                  {typeof service.price === 'number'
                    ? service.price.toFixed(2)
                    : '0.00'}{' '}
                  €
                </span>
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
