'use client';

import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { SelectableUser } from 'types';

interface UserSelectionProps {
  users: SelectableUser[];
  setSelectedUser: (user: SelectableUser) => void;
  selectedUser: SelectableUser | null;
}

const UserSelection = ({
  users,
  setSelectedUser,
  selectedUser
}: UserSelectionProps) => {
  const handleUserSelect = (user: SelectableUser) => {
    setSelectedUser(user);
  };
  const t = useTranslations('user-selection');

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Menu as="div" className="relative">
        <div>
          <MenuButton className="relative flex items-center px-6 py-3 bg-brown-600  bg-primary text-secondary text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brown-600 transition-transform transform hover:scale-105">
            {selectedUser
              ? `${selectedUser.name} (${selectedUser.email})`
              : t('select-user')}
          </MenuButton>
        </div>

        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
          {users.map((user: SelectableUser) => (
            <MenuItem
              key={user.id}
              as="button"
              className="block w-full px-4 py-2 text-left text-gray-800 text-sm hover:bg-gray-100 hover:text-primary-dark transition-colors border-b"
              onClick={() => handleUserSelect(user)}
            >
              {user.name}, {user.email}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default UserSelection;
