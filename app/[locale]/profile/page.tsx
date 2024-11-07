'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from 'components/Layout';
import { toast } from 'react-toastify';
import { User } from 'firebase/auth';

const Component = () => {
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setUploading(true);

      if (user && name) {
        await updateProfile(user, { displayName: name });
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { displayName: name });
        toast.success('Name updated successfully!');
      }

      if (password) {
        await updatePassword(user as User, password);
        toast.success('Password updated successfully!');
      }

      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-md px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Update Profile
        </h2>
        <form>
          {/* Name Input */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block text-gray-700"
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 border bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Update Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block text-gray-700"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="w-full max-w-sm py-3 px-6 bg-primary text-secondary text-lg font-semibold rounded-md shadow-sm hover:opacity-70 transition-colors"
            >
              {uploading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Profile() {
  return (
    <Layout>
      <Component />
    </Layout>
  );
}
