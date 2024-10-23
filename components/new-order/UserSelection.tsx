'use client';

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { SelectableUser } from 'types';

interface UserSelectionProps {
  users: SelectableUser[];
  setSelectedUser: (user: SelectableUser) => void;
  selectedUser: SelectableUser | null;
  setStep: (step: number) => void;
}

const UserSelection = ({
  users,
  setSelectedUser,
  selectedUser,
  setStep
}: UserSelectionProps) => {
  const handleUserSelect = (user: SelectableUser) => {
    setSelectedUser(user);
  };
  const t = useTranslations('user-selection');
  const tNewOrder = useTranslations('new-order');

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Menu as="div" className="relative">
        <div>
          <MenuButton className="relative flex items-center px-6 py-3 bg-brown-600  bg-primary text-secondary text-base font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brown-600 transition-transform transform hover:scale-105">
            {selectedUser
              ? `${selectedUser.name} (${selectedUser.email})`
              : t('select-user')}
          </MenuButton>
        </div>

        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {users.map((user: SelectableUser) => (
            <MenuItem
              key={user.id}
              as="button"
              className="block w-full px-4 py-2 text-left text-gray-800 text-sm hover:bg-gray-100 hover:text-primary-dark transition-colors"
              onClick={() => handleUserSelect(user)}
            >
              {user.name}, {user.email}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>

      <div className="mt-6 flex justify-between w-full max-w-md">
        <button
          className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-all"
          onClick={() => setStep(1)}
        >
          {tNewOrder('back')}
        </button>
        <button
          className={`px-6 py-2 rounded text-secondary ${
            selectedUser
              ? 'bg-primary hover:bg-brown-700 '
              : 'bg-gray-400 cursor-not-allowed'
          } transition-all`}
          onClick={() => setStep(2)}
          disabled={!selectedUser}
        >
          {t('next-select-services')}
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
