'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Layout from '@/components/Layout';
import { toast } from 'react-toastify';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Loading from '@/components/Loading';

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  services: string[];
  totalPrice: number;
  status: string;
  paymentEnabled: boolean;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus
    });
    toast.success('Order status updated successfully');
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const enablePaymentForOrder = async (
    orderId: string,
    userName: string,
    userEmail: string,
    totalPrice: number,
    services: string[]
  ) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentEnabled: true
    });
    toast.success('Payment enabled for the user');
    await fetch('/api/send-payment-available-notification', {
      method: 'POST',
      body: JSON.stringify({
        userName,
        userEmail,
        orderDetails: services.join(', '),
        totalPrice
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, paymentEnabled: true } : order
      )
    );
  };

  if (loading) {
    return <Loading />;
  }

  const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled'];

  return (
    <Layout title="Orders">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the orders including user info, service type,
              status, and payment status.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      User Info
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Service Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total Price
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
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
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {order.userName}
                        </div>
                        <div className="text-gray-500">{order.userEmail}</div>
                        <div className="text-gray-500">{order.userAddress}</div>
                        <div className="text-gray-500">{order.userPhone}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <ul>
                          {order.services.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {order.totalPrice} €
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        {/* Custom dropdown for status */}
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                              {order.status}
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="-mr-1 h-5 w-5 text-gray-400"
                              />
                            </MenuButton>
                          </div>

                          <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {statusOptions.map((status) => (
                                <MenuItem key={status}>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? 'bg-gray-100 text-gray-900'
                                          : 'text-gray-700'
                                      } block w-full px-4 py-2 text-left text-sm`}
                                      onClick={() =>
                                        handleStatusChange(order.id, status)
                                      }
                                    >
                                      {status}
                                    </button>
                                  )}
                                </MenuItem>
                              ))}
                            </div>
                          </MenuItems>
                        </Menu>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm">
                        {order.paymentEnabled ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium">
                        {!order.paymentEnabled && (
                          <button
                            className="bg-primary text-white px-3 py-2 rounded-md shadow-sm hover:opacity-90"
                            onClick={() =>
                              enablePaymentForOrder(
                                order.id,
                                order.userName,
                                order.userEmail,
                                order.totalPrice,
                                order.services
                              )
                            }
                          >
                            Enable Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
