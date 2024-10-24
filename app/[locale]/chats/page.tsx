'use client';

import { useEffect } from 'react';
import {
  fetchChats,
  sendMessage,
  setSelectedChatId,
  setMessage,
  setSearchTerm,
  setUnreadMessages,
  updateIsRead
} from 'store/slices/chats-slice';
import Layout from 'components/Layout';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { FiPaperclip, FiSearch } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { Chat } from 'types';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import { useChatScroll } from 'hooks/use-chat-scroll';

export default function AdminChat() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId, message, uploading, searchTerm } =
    useAppSelector((state) => state.chats);
  const chatRef = useChatScroll(chats);

  const selectedUserChat: Chat | undefined = chats.find(
    (u: Chat) => u.id === selectedChatId
  );
  const t = useTranslations('chats');

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    dispatch(
      sendMessage({ selectedUserId: selectedChatId!, message, images: [] })
    );
  };

  const handleSendOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUserChats = chats.filter((u: Chat) =>
    u.name
      ? u.name.toLowerCase().includes(searchTerm.toLowerCase())
      : u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadMessages = (chatId: string) => {
    const chat = chats.find((c: Chat) => c.id === chatId);
    if (!chat) return 0;

    return chat.messages.filter((m) => m.sender !== 'admin' && !m.isRead)
      .length;
  };

  return (
    <Layout title={t('admin-dashboard')}>
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/4 bg-white p-4 border-r h-full overflow-y-auto">
          <div className="flex items-center bg-white p-2 rounded-lg shadow">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder={t('search-users')}
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="ml-2 w-full outline-none text-sm"
            />
          </div>

          <div className="mt-4 flex flex-col">
            {filteredUserChats.length > 0 ? (
              filteredUserChats.map((chat: Chat) => (
                <div
                  key={chat.id}
                  className={`p-4 bg-white my-2 rounded-lg shadow cursor-pointer ${
                    selectedUserChat?.id === chat.id ? 'bg-gray-300' : ''
                  }`}
                  onClick={async () => {
                    dispatch(setSelectedChatId(chat.id));
                    dispatch(setUnreadMessages(chat.id));

                    if (unreadMessages(chat.id) > 0) {
                      dispatch(updateIsRead(chat.id)); // Correctly dispatch the action to mark messages as read
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="">
                      <h2 className="font-semibold text-black">
                        {t('order')} ID: {chat.id.slice(0, 5)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {chat.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{chat.email}</p>
                      {unreadMessages(chat.id) > 0 && (
                        <p className="text-red-700 mt-2 font-semibold">
                          {t('unread')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">{t('no-users')}</p>
            )}
          </div>
        </div>

        <div
          className="flex flex-col w-full"
          ref={chatRef}
          style={{ maxHeight: 'calc(100vh - 150px)' }}
        >
          <div className="flex flex-col bg-gray-50 h-full">
            {selectedUserChat ? (
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedUserChat.messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`mb-4 ${
                      msg.sender === 'Admin' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg shadow ${
                        msg.sender === 'Admin'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {msg.content && <p>{msg.content}</p>}
                      <span className="text-xs text-gray-300">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h2 className="text-gray-500">{t('select-user-text')}</h2>
              </div>
            )}
          </div>
          {/* Chat input */}
          <div className="sticky bottom-0 p-4 bg-white shadow flex flex-col z-10">
            <div className="p-4 bg-gray-100 shadow flex items-center sticky bottom-0">
              <label htmlFor="file-upload" className="cursor-pointer">
                <FiPaperclip className="text-gray-500 mr-2" />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={() => {}}
                multiple
              />
              <input
                type="text"
                value={message}
                onChange={(e) => dispatch(setMessage(e.target.value))}
                placeholder={t('type-message')}
                className="flex-1 bg-gray-200 p-2 rounded-lg outline-none"
                onKeyDown={handleSendOnEnter}
              />
              <button
                onClick={handleSendMessage}
                className="ml-4 bg-primary text-white p-2 rounded-lg"
                disabled={uploading}
              >
                {uploading ? (
                  <AiOutlineLoading className="animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
