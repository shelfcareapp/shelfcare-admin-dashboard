'use client';

import { auth } from '../firebase';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import { fetchChats, setSelectedChatId } from 'store/slices/chats-slice';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useOutsideClick } from 'hooks/use-outside-click';

export interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function LayoutComponent({ title, children }: LayoutProps) {
  const [user, loading] = useAuthState(auth);
  const { chats } = useAppSelector((state) => state.chats);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const bellRef = useRef(null);
  const t = useTranslations('header');

  useOutsideClick(bellRef, () => {
    setNotificationOpen(false);
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const unreadChats = chats.filter((chat) =>
    chat.messages.some((msg) => !msg.isRead)
  );

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleNotificationItemClick = async (chatId: string) => {
    if (isUpdating) return;

    setIsUpdating(true);
    dispatch(setSelectedChatId(chatId));

    const chat = unreadChats.find((chat) => chat.id === chatId);
    if (!chat) return;

    try {
      setNotificationOpen(false);
      router.push(`/chats`);
    } catch (error) {
      console.error('Error updating messages:', error);
      toast.error('Failed to mark messages as read');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <Disclosure as="nav" className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-secondary">Shelfcare</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="/"
                    className={classNames(
                      'bg-primary text-secondary',
                      'rounded-md px-3 py-2 font-medium'
                    )}
                  >
                    {t('messages')}
                  </a>
                  <a
                    href="/new-order"
                    className="text-secondary hover:bg-[#A52A2A] hover:text-white rounded-md px-3 py-2 font-medium"
                  >
                    {t('new-order')}
                  </a>
                  <a
                    href="/orders"
                    className="text-secondary hover:bg-[#A52A2A] hover:text-white rounded-md px-3 py-2 font-medium"
                  >
                    {t('orders')}
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <LanguageSwitcher />
                <div className="relative" ref={bellRef}>
                  <button
                    type="button"
                    onClick={handleNotificationClick}
                    className="relative rounded-full bg-primary p-1 text-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                    {unreadChats.length > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {unreadChats.length}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
                      <h3 className="font-semibold text-lg mb-2">
                        New Messages
                      </h3>
                      <ul>
                        {unreadChats.length > 0 ? (
                          unreadChats.map((chat) => (
                            <li
                              key={chat.id}
                              className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() =>
                                handleNotificationItemClick(chat.id)
                              }
                            >
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  Order ID: {chat.id.slice(0, 5)}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {chat.name || 'Unknown User'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {chat.email || 'No email'}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded-full">
                                  {
                                    chat.messages.filter((msg) => !msg.isRead)
                                      .length
                                  }
                                </span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No new messages.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-primary text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                      <span className="sr-only">Open user menu</span>
                      <AiOutlineUser className="h-8 w-8 text-secondary" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <MenuItem>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('profile')}
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {t('sign-out')}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-primary p-2 text-secondary hover:bg-[#A52A2A] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <DisclosureButton
              as="a"
              href="/"
              className="bg-primary text-secondary block rounded-md px-3 py-2 text-base font-medium"
            >
              Messages
            </DisclosureButton>
            <DisclosureButton
              as="a"
              href="/new-order"
              className="text-secondary hover:bg-[#A52A2A] hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              New Order
            </DisclosureButton>
            <DisclosureButton
              as="a"
              href="/orders"
              className="text-secondary hover:bg-[#A52A2A] hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >
              Orders
            </DisclosureButton>
          </div>
          <div className="border-t border-[#A52A2A] pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <AiOutlineUser className="h-10 w-10 text-secondary" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-secondary">Hi,</div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <DisclosureButton
                as="a"
                href="/profile"
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary hover:bg-[#A52A2A] hover:text-white"
              >
                {t('profile')}
              </DisclosureButton>
              <DisclosureButton
                as="a"
                href="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-secondary hover:bg-[#A52A2A] hover:text-white"
                onClick={handleSignOut}
              >
                {t('sign-out')}
              </DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold leading-6 text-primary">
            {title}
          </h1>
        </div>
      </header>
      <main className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-grow">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function Layout({ title, children }: LayoutProps) {
  return <LayoutComponent title={title}>{children}</LayoutComponent>;
}
