'use client';

import { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import Loading from 'components/Loading';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import {
  fetchOrders,
  selectOrders,
  selectLoading
} from 'store/slices/orders-slice';
import {
  deleteOrder
  // updatePaymentStatus
} from 'store/slices/order-selection-slice';
import { Order } from 'types';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const filterOptions = [
  { value: 'pickup-time', label: 'Pickup Time' },
  { value: 'delivery-time', label: 'Delivery Time' }
  // { value: 'payment-status', label: 'Payment Status' }
];

// const paymentStatusOptions = {
//   Paid: 'Paid',
//   Pending: 'Pending'
// };

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const router = useRouter();
  const loading = useAppSelector(selectLoading);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(5);

  const [reloadOrders, setReloadOrders] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  // const [paymentEnabled, setPaymentEnabled] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [reloadOrders, dispatch]);

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) {
      toast.error('No order selected.');
      return;
    }

    await dispatch(deleteOrder(orderId));
    setReloadOrders(true);
  };

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

  // const setPaymentStatus = async (orderId: string, status: string) => {
  //   await dispatch(updatePaymentStatus({ orderId, status }));
  //   setReloadOrders(true);
  // };

  const handleFilter = (filter: string) => {
    if (filter === selectedFilter) {
      setSelectedFilter('');
    } else {
      setSelectedFilter(filter);
    }
  };

  const filteredOrders = currentOrders.filter((order: Order) => {
    if (selectedFilter === 'pickup-time') {
      return order.pickupTime && !!order.pickupTime.date;
    }
    if (selectedFilter === 'delivery-time') {
      return order.deliveryTime && !!order.deliveryTime.date;
    }
    if (selectedFilter === 'paid') {
      return order.paymentStatus.toLowerCase() === 'paid';
    }

    return order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 min-h-1/2">
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white p-2 rounded-lg shadow w-1/3">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-full outline-none text-sm"
            />
          </div>

          <ul tabIndex={0} className="flex items-center gap-3">
            {filterOptions.map((option) => (
              <li
                key={option.value}
                className={`p-2 bg-slate-200 rounded-md cursor-pointer text-sm hover:bg-slate-300
                  ${selectedFilter === option.value && 'opacity-60'}
                  `}
                onClick={() => handleFilter(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>

          <button
            className="px-3 py-2 rounded-md bg-primary text-white"
            onClick={() => router.push('/new-order')}
          >
            New Order
          </button>
        </div>
        <div className="mt-8 flow-root h-full w-full">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 h-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Customer Info
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Order Id
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
                    {/* <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Payment Status
                    </th> */}
                    <th className="relative py-3.5 pl-3 pr-4 text-sm font-semibold text-gray-900 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white w-full">
                  {loading && <Loading />}

                  {!loading && filteredOrders ? (
                    filteredOrders.map((order: Order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                          <div className="font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-gray-500">
                            {order.customerEmail}
                          </div>
                          <div className="text-gray-500">
                            <strong>Osoite:</strong> {order.customerAddress}
                          </div>
                          <div className="text-gray-500">
                            <strong>Kaupunki:</strong> {order.customerCity}
                          </div>
                          <div className="text-gray-500 break-words text-wrap">
                            <strong>Lisätietoa:</strong>{' '}
                            {order.customerEntranceInfo}
                          </div>

                          <div className="text-gray-500">
                            <strong>Puhelinnumero</strong> {order.customerPhone}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {order.totalPrice} €
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {order?.pickupTime?.date?.toString()}{' '}
                          {order?.pickupTime?.time?.toString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {order?.deliveryTime?.date?.toString()}{' '}
                          {order?.deliveryTime?.time?.toString()}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 text-center">
                          <div className="dropdown">
                            <div
                              tabIndex={0}
                              role="button"
                              className="border border-primary p-1 rounded-md"
                            >
                              {order?.paymentStatus || 'Not set'}
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu bg-base-100 rounded-box z-6 w-52 shadow"
                            >
                              <li
                                className="p-2 border-b border-base-200 cursor-pointer last:border-0 hover:bg-slate-200"
                                onClick={() =>
                                  setPaymentStatus(
                                    order.id,
                                    paymentStatusOptions.Paid
                                  )
                                }
                              >
                                Paid
                              </li>
                              <li
                                className="p-2 border-b border-base-200 cursor-pointer last:border-0 hover:bg-slate-200"
                                onClick={() =>
                                  setPaymentStatus(
                                    order.id,
                                    paymentStatusOptions.Pending
                                  )
                                }
                              >
                                Pending
                              </li>
                            </ul>
                          </div>
                        </td> */}
                        <td className="whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium">
                          <button
                            className={`px-3 py-1 rounded-md bg-blue-50 text-blue-950`}
                            onClick={() => {
                              router.push(`/orders/${order.id}`);
                            }}
                          >
                            {t('edit')}
                          </button>

                          <button
                            className="px-3 py-1 rounded-md bg-red-50 text-red-950 ml-2"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
    </Layout>
  );
}
