import { useAppDispatch } from 'hooks/use-store';
import React from 'react';
import {
  addSelectedService,
  setTotalPrice
} from 'store/slices/service-selection-slice';

const CustomServiceForm = ({ customService, setCustomService, totalPrice }) => {
  const dispatch = useAppDispatch();

  const handleCustomServiceChange = (e) => {
    setCustomService((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCustomAddToServices = () => {
    if (customService.name && customService.price > 0) {
      dispatch(
        addSelectedService({
          parent: 'custom',
          price: Number(customService.price),
          quantity: 1,
          name: customService.name,
          discount: 0,
          additionalInfo: ''
        })
      );

      dispatch(setTotalPrice(totalPrice + parseFloat(customService.price)));

      setCustomService({ name: '', price: 0, parent: 'custom' });
    }
  };

  return (
    <div className="mt-8 w-3/4 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Custom Service</h3>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Service Name"
          className="p-2 border border-gray-300 rounded w-2/3"
          name="name"
          value={customService.name}
          onChange={handleCustomServiceChange}
        />
        <input
          type="number"
          placeholder="Price"
          className="p-2 border border-gray-300 rounded w-1/4 ml-4"
          name="price"
          value={customService.price}
          onChange={handleCustomServiceChange}
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded ml-4"
          onClick={handleCustomAddToServices}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CustomServiceForm;
