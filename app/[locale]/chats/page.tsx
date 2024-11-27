'use client';

import { useState } from 'react';
import Layout from 'components/Layout';
import { useLocale, useTranslations } from 'next-intl';
import { FiPaperclip } from 'react-icons/fi';
import React, { useEffect } from 'react';
import {
  setSelectedChatId,
  listenToAllChats,
  sendMessage,
  setMessage
} from 'store/slices/chats-slice';
import { Chat } from 'types';
import { useAppDispatch, useAppSelector } from 'hooks/use-store';
import { useChatScroll } from 'hooks/use-chat-scroll';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import NewChatNotification from 'components/NewChatNotification';
import { selectUsers } from 'store/slices/users-slice';
import { setSelectedUser } from 'store/slices/user-selection-slice';
import { useRouter } from 'next/navigation';

export default function Component() {
  const [selectedChat, setSelectedChat] = useState({
    name: '',
    email: '',
    id: ''
  });
  const [chatColors, setChatColors] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { chats, selectedChatId, searchTerm, loading, message } =
    useAppSelector((state) => state.chats);
  const users = useAppSelector(selectUsers);
  const chatRef = useChatScroll(chats);
  const locale = useLocale();
  const router = useRouter();

  const chatsToUse = Array.isArray(chats) ? chats : [];
  const selectedUserChat: Chat | undefined = chatsToUse.find(
    (u: Chat) => u.id === selectedChatId
  );
  const t = useTranslations('chats');
  const tCommon = useTranslations('common');

  useEffect(() => {
    const unsubscribe = dispatch(listenToAllChats());
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    setChatColors((prevColors) => {
      const newColors = { ...prevColors };
      if (Array.isArray(chats)) {
        chats.forEach((chat) => {
          if (!newColors[chat.id]) {
            newColors[chat.id] = getRandomColor();
          }
        });
        return newColors;
      }
    });
  }, [chats]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chats, selectedChatId]);

  const getNameInitials = (name: string) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    const initials =
      words.length > 1
        ? `${words[0][0]}${words[words.length - 1][0]}`
        : `${words[0][0]}`;
    return initials.toUpperCase();
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const filteredUserChats = chats.filter(
    (chat: Chat) =>
      chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => (prev ? [...prev, ...filesArray] : filesArray));
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    if (images) {
      const updatedImages = images.filter((_, i) => i !== index);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImages(updatedImages);
      setImagePreviews(updatedPreviews);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && (!images || images.length === 0)) return;

    let imageUrls = [];
    if (images) {
      const uploadPromises = images.map((image) => {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `chat-images/${selectedChatId}/${Date.now()}-${image.name}`
        );
        return uploadBytes(storageRef, image).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    dispatch(
      sendMessage({
        selectedUserId: selectedChatId,
        message,
        images: imageUrls,
        sender: 'Admin',
        type: 'text',
        orderId: null
      })
    );

    setMessage('');
    setImages(null);
    setImagePreviews([]);
  };

  const handleSendOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showImagePreviews = () => {
    if (imagePreviews.length > 0) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {imagePreviews.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-white rounded-full text-red-500 hover:text-red-700 p-1"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };
  // if selectedChat is not empty, show header
  const showHeader = () => {
    for (let key in selectedChat) {
      if (selectedChat[key] !== '') {
        return true;
      }
    }
    return false;
  };

  const handleUserSelection = () => {
    const user = users.find((user) => user.email === selectedChat.email);
    dispatch(setSelectedUser(user));

    // navigate to new order page
    router.push('/new-order');
  };

  return (
    <Layout>
      <div className="flex h-screen bg-base-100">
        {/* Chat List */}
        <div className="w-1/4 border-r border-base-300  flex flex-col">
          <div className="flex items-center justify-between border-b border-base-300 px-4 py-2">
            <span className="text-lg font-medium">{tCommon('messages')}</span>
            <button className="btn btn-ghost btn-square btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {loading ? (
                <p className="text-gray-500">{t('loading...')}</p>
              ) : filteredUserChats.length > 0 ? (
                filteredUserChats.map((chat: Chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-base-200 space-y-1 ${
                      selectedChat.name === chat.name ? 'bg-base-200' : ''
                    }`}
                    onClick={async () => {
                      dispatch(setSelectedChatId(chat.id));
                      setSelectedChat({
                        name: chat.name,
                        email: chat.email,
                        id: chat.id
                      });
                    }}
                  >
                    <div
                      className={`avatar placeholder rounded-full`}
                      style={{ backgroundColor: chatColors[chat.id] }}
                    >
                      <div className="w-12 h-12  rounded-full text-neutral-content">
                        <span className="text-sm font-semibold">
                          {getNameInitials(chat.name || 'Unknown')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{chat.name}</span>
                        <span className="text-xs text-base-content/60">
                          {chat.unreadCount}
                        </span>
                      </div>
                      <p className="truncate text-sm text-base-content/60">
                        {chat.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </div>

        {/* Messaging Section */}
        <div className="flex flex-1 flex-col">
          {showHeader() && (
            <div className="flex items-center justify-between border-b border-base-300 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="avatar placeholder w-10 h-10 rounded-full bg-primary">
                  <div className=" text-neutral-content">
                    <span className="text-xs">
                      {getNameInitials(selectedChat.name)}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-medium">{selectedChat.name}</span>
              </div>
              {/* <button
                className="bg-primary cursor-pointer p-2 rounded-lg text-white"
                onClick={handleUserSelection}
              >
                {locale === 'fi' ? 'Tee uusi tilaus' : 'Make new order'}
              </button> */}
              <NewChatNotification
                locale={locale}
                userEmailAddress={selectedChat.email}
                userName={selectedChat.name}
              />
            </div>
          )}

          {/* Message Area */}
          <div className="flex-1 overflow-auto">
            <div className="flex h-full flex-col items-center justify-center text-center bg-gray-50">
              <div className="flex flex-col h-full w-full">
                {selectedUserChat ? (
                  <div className="flex-1 p-4 overflow-y-auto" ref={chatRef}>
                    {selectedUserChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          msg.sender === 'Admin' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block p-2 rounded-lg shadow max-w-md  ${
                            msg.sender === 'Admin'
                              ? 'bg-primary text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                          {msg.imageUrls && msg.imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {msg.imageUrls.map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt="Sent image"
                                  className="w-20 h-20 rounded-md"
                                />
                              ))}
                            </div>
                          )}
                          {msg.content && (
                            <p
                              dangerouslySetInnerHTML={{ __html: msg.content }}
                              className="text-left"
                            />
                          )}
                          <span className="text-xs text-slate-600">
                            {msg.time}
                          </span>
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
            </div>
          </div>

          <div className="border-t border-base-300 p-4">
            {showImagePreviews()}
            <div className="relative border">
              <div className="flex items-center">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FiPaperclip className="text-gray-500 mx-2" />
                </label>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <input
                  type="text"
                  value={message}
                  onChange={(e) => dispatch(setMessage(e.target.value))}
                  placeholder={t('type-message')}
                  className="flex-1 bg-inherit p-2 rounded-lg outline-none"
                  onKeyDown={handleSendOnEnter}
                />

                <button
                  onClick={handleSendMessage}
                  className="ml-4 bg-primary text-white p-2 rounded-lg cursor-pointer"
                >
                  <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
