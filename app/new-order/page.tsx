'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Layout from '@/components/Layout';
import {
  tailoringServices,
  cobblerServices,
  laundryServices
} from './services';
import { toast } from 'react-toastify';

export default function OrderForm() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: boolean;
  }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [step, setStep] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // For collapsible categories

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  const handleSelectUser = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser) {
      setSelectedUserId(userId);
      setUserEmail(selectedUser.email);
      setUserName(selectedUser.name);
      setUserAddress(selectedUser.address || '');
      setUserPhone(selectedUser.phone || '');
    }
  };

  const handleServiceToggle = (serviceName: string, servicePrice: number) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
    setTotalPrice((prev) =>
      selectedServices[serviceName] ? prev - servicePrice : prev + servicePrice
    );
  };

  const handleConfirmOrder = async () => {
    if (!selectedUserId) {
      toast.success('Please select a user');
      return;
    }

    const selectedServiceNames = Object.keys(selectedServices).filter(
      (service) => selectedServices[service]
    );
    const orderData = {
      userId: selectedUserId,
      userEmail,
      userName,
      userAddress,
      userPhone,
      services: selectedServiceNames,
      totalPrice,
      orderDate: new Date().toISOString()
    };

    try {
      await setDoc(
        doc(db, 'orders', selectedUserId + '_' + new Date().getTime()),
        orderData
      );
      toast.success('Order saved successfully!');
      await fetch('/api/send-order-confirmation-email', {
        method: 'POST',
        body: JSON.stringify({
          userName,
          userEmail,
          orderDetails: selectedServiceNames.join(', '),
          totalPrice
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Error saving order. Please try again.');
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const renderServiceSection = (categoryName: string, services: any[]) => {
    const isExpanded = expandedCategory === categoryName;

    return (
      <div className="mb-4">
        <div
          className="cursor-pointer bg-secondary text-primary p-3 rounded"
          onClick={() => toggleCategory(categoryName)}
        >
          {categoryName} {isExpanded ? '-' : '+'}
        </div>
        {isExpanded && (
          <div className="bg-gray-100 p-3">
            {services.map((service) => (
              <div key={service.name} className="mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!selectedServices[service.name]}
                    onChange={() =>
                      handleServiceToggle(service.name, service.price)
                    }
                  />
                  <label className="ml-2">
                    {service.name} - {service.price} €
                  </label>
                </div>

                {/* Sub-options, if they exist */}
                {service.additionalOptions &&
                  service.additionalOptions.length > 0 && (
                    <div className="ml-6 mt-2">
                      {service.additionalOptions.map((subOption: any) => (
                        <div
                          key={subOption.name}
                          className="flex items-center mt-2"
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedServices[subOption.name]}
                            onChange={() =>
                              handleServiceToggle(
                                subOption.name,
                                subOption.price
                              )
                            }
                          />
                          <label className="ml-2">
                            {subOption.name} - {subOption.price} €
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title="New order">
      <div className="container mx-auto py-6">
        {step === 1 && (
          <div>
            <h1 className="text-3xl mb-6 text-primary">Order Form</h1>

            {/* User Selection Dropdown */}
            <div className="mb-6">
              <label className="block mb-2">Select User</label>
              <select
                value={selectedUserId || ''}
                onChange={(e) => handleSelectUser(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">-- Select a User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Prefill User Details */}
            <div className="mb-6">
              <label className="block mb-2">User Name</label>
              <input
                type="text"
                value={userName}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />

              <label className="block mt-4 mb-2">User Email</label>
              <input
                type="email"
                value={userEmail}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />

              <label className="block mt-4 mb-2">User Address</label>
              <input
                type="text"
                value={userAddress}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />

              <label className="block mt-4 mb-2">User Phone</label>
              <input
                type="text"
                value={userPhone}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            {/* Collapsible Service Sections */}
            <h2 className="text-2xl mb-4">Select Services</h2>
            {renderServiceSection(
              'Tailoring Services',
              tailoringServices.housut
            )}
            {renderServiceSection('Cobbler Services', cobblerServices.kengat)}
            {renderServiceSection('Laundry Services', laundryServices)}

            <div className="mt-6">
              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => setStep(2)}
              >
                Next: Review Order
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-3xl mb-6 text-primary">Review Order</h1>
            <p>
              <strong>User ID:</strong> {selectedUserId}
            </p>
            <p>
              <strong>User Name:</strong> {userName}
            </p>
            <p>
              <strong>User Email:</strong> {userEmail}
            </p>
            <p>
              <strong>User Address:</strong> {userAddress}
            </p>
            <p>
              <strong>User Phone:</strong> {userPhone}
            </p>

            <h2 className="text-2xl mt-4">Selected Services</h2>
            <ul>
              {Object.keys(selectedServices)
                .filter((service) => selectedServices[service])
                .map((service) => (
                  <li key={service}>{service}</li>
                ))}
            </ul>

            <h3 className="text-xl mt-4">Total Price: {totalPrice} €</h3>

            <div className="mt-6">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-4"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
