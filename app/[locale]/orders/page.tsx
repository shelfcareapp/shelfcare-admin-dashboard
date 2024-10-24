'use client';

import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import Loading from 'components/Loading';
import Breadcrumbs from 'components/Breadcrumbs';
import Modal from 'components/Modal';
import ServiceSelection from 'components/new-order/ServiceSelection';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import {
  fetchOrders,
  selectOrders,
  selectLoading
} from 'store/slices/orders-slice';
import {
  deleteOrder,
  // updateOrder,
  updatePaymentStatus
} from 'store/slices/order-selection-slice';
import {
  // setSelectedServices,
  selectSelectedServices
} from 'store/slices/service-selection-slice';
import { Order, SelectedServices } from 'types';
import { calculateTotalPrice } from 'utils/calculate-total-price';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const selectedServices = useAppSelector(selectSelectedServices);
  const loading = useAppSelector(selectLoading);

  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(5);
  const [showModalForOrderId, setShowModalForOrderId] = useState<string | null>(
    null
  );
  const [currentOrderServices, setCurrentOrderServices] =
    useState<SelectedServices>();
  const [pickupTime, setPickupTime] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [reloadOrders, setReloadOrders] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, reloadOrders]);

  useEffect(() => {
    if (editOrderId) {
      const order = orders.find((o) => o.id === editOrderId);
      if (order) {
        setPickupTime(order.pickupTime || '');
        setDeliveryTime(order.deliveryTime || '');
        setCurrentOrderServices(order.services || {});
      }
    }
  }, [editOrderId, orders, reloadOrders]);

  const updateServiceDetails = (
    serviceKey: string,
    updatedData: Partial<SelectedServices>
  ) => {
    setCurrentOrderServices((prevServices) => ({
      ...prevServices,
      [serviceKey]: {
        ...prevServices[serviceKey],
        ...updatedData
      }
    }));
  };

  const removeService = (serviceKey: string) => {
    setCurrentOrderServices((prevServices) => {
      const updatedServices = { ...prevServices };
      delete updatedServices[serviceKey];
      return updatedServices;
    });
  };

  const toggleEditOrder = (orderId: string) => {
    setEditOrderId(editOrderId === orderId ? null : orderId);
  };

  const saveEdits = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const finalPrice = calculateTotalPrice(
      currentOrderServices,
      order.discount || 0
    );
    const orderData = {
      services: currentOrderServices,
      pickupTime,
      deliveryTime,
      totalPrice: finalPrice
    } as unknown as Partial<Order>;
    console.log(orderData);

    // await dispatch(updateOrder({ orderId, orderData }));
    // dispatch(setSelectedServices(currentOrderServices));
    setEditOrderId(null);
    setReloadOrders(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) {
      toast.error('No order selected.');
      return;
    }

    await dispatch(deleteOrder(orderId));
  };

  const handleConfirmNewService = () => {
    setCurrentOrderServices((prevServices) => ({
      ...prevServices,
      ...selectedServices
    }));
    setShowModalForOrderId(null);
  };

  if (loading) {
    return <Loading />;
  }

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setPaymentStatus = async (orderId: string, status: string) => {
    await dispatch(updatePaymentStatus({ orderId, status }));
    setReloadOrders(true);
  };

  return (
    <Layout title="Orders">
      <Breadcrumbs
        paths={[{ label: 'Home', href: '/' }, { label: 'Orders' }]}
      />
      <div className="px-4 sm:px-6 lg:px-8 h-screen">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the orders including customer info, service type,
              status, payment status, and pickup/delivery times.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root h-full">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 h-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Customer Info
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Service Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Price
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pickup Time
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Delivery Time
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Payment Status
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 text-sm font-semibold text-gray-900 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-gray-500">
                          {order.customerEmail}
                        </div>
                        <div className="text-gray-500">
                          {order.customerAddress}
                        </div>
                        <div className="text-gray-500">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {editOrderId === order.id ? (
                          <ul>
                            {Object.keys(currentOrderServices).map(
                              (serviceKey) => (
                                <li
                                  key={serviceKey}
                                  className="flex items-center space-x-2 mb-2"
                                >
                                  <span>
                                    {currentOrderServices[serviceKey]?.name}:
                                  </span>
                                  <input
                                    type="number"
                                    className="w-16 p-1 border border-gray-300 rounded"
                                    value={
                                      currentOrderServices[serviceKey]
                                        ?.quantity || 0
                                    }
                                    onChange={(e) =>
                                      updateServiceDetails(serviceKey, {
                                        quantity: parseInt(e.target.value, 10)
                                      })
                                    }
                                    min="1"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Discount"
                                    className="w-20 p-1 ml-2 border border-gray-300 rounded"
                                    value={
                                      currentOrderServices[serviceKey]
                                        ?.discount || 0
                                    }
                                    onChange={(e) =>
                                      updateServiceDetails(serviceKey, {
                                        discount: parseInt(e.target.value, 10)
                                      })
                                    }
                                    min="0"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Additional Info"
                                    className="w-40 p-1 ml-2 border border-gray-300 rounded"
                                    value={
                                      currentOrderServices[serviceKey]
                                        ?.additionalInfo || ''
                                    }
                                    onChange={(e) =>
                                      updateServiceDetails(serviceKey, {
                                        additionalInfo: e.target.value
                                      })
                                    }
                                  />
                                  <span>
                                    x {currentOrderServices[serviceKey]?.price}€
                                  </span>
                                  <button
                                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                    onClick={() => removeService(serviceKey)}
                                  >
                                    Remove
                                  </button>
                                </li>
                              )
                            )}
                            <button
                              className="px-3 py-1 rounded-md bg-yellow-50 text-yellow-950 ml-2"
                              onClick={() => {
                                setShowModalForOrderId(order.id);
                              }}
                            >
                              Add new service
                            </button>
                          </ul>
                        ) : (
                          <ul>
                            {Object.keys(order.services).map((serviceKey) => (
                              <li key={serviceKey}>
                                {order.services[serviceKey].name}:{' '}
                                {order.services[serviceKey].quantity} x{' '}
                                {order.services[serviceKey].price}€
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {order.totalPrice} €
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {editOrderId === order.id ? (
                          <input
                            type="datetime-local"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={pickupTime || ''}
                            onChange={(e) => setPickupTime(e.target.value)}
                          />
                        ) : (
                          order.pickupTime || 'Not set'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {editOrderId === order.id ? (
                          <input
                            type="datetime-local"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={deliveryTime || ''}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                          />
                        ) : (
                          order.deliveryTime || 'Not set'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <select
                          className="w-24 p-2 border border-gray-300 rounded"
                          value={order.paymentStatus}
                          onChange={(e) =>
                            setPaymentStatus(order.id, e.target.value)
                          }
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium">
                        <button
                          className={`px-3 py-1 rounded-md ${
                            editOrderId === order.id
                              ? 'bg-green-50 text-green-950'
                              : 'bg-blue-50 text-blue-950'
                          }`}
                          onClick={() => {
                            if (editOrderId === order.id) {
                              saveEdits(order.id);
                            } else {
                              toggleEditOrder(order.id);
                            }
                          }}
                        >
                          {editOrderId === order.id ? 'Save' : 'Edit'}
                        </button>

                        <button
                          className="px-3 py-1 rounded-md bg-red-50 text-red-950 ml-2"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={
                currentPage === Math.ceil(orders.length / ordersPerPage)
              }
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {editOrderId && showModalForOrderId === editOrderId && (
        <Modal
          title="Add New Service"
          onClose={() => setShowModalForOrderId(null)}
          isOpen={showModalForOrderId === editOrderId}
          onConfirm={handleConfirmNewService}
        >
          <div className="space-y-4">
            <ServiceSelection />
          </div>
        </Modal>
      )}
    </Layout>
  );
}
