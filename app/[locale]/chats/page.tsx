'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import Layout from 'components/Layout';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { FiPaperclip, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Message, User } from '../../../types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { AiOutlineLoading } from 'react-icons/ai';
import { useTranslations } from 'next-intl';

export default function AdminChat() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const t = useTranslations('chats');

  const selectedUser = users.find((u: User) => u.id === selectedChatId);

  useEffect(() => {
    const usersRef = collection(db, 'chats');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      setUsers(fetchedUsers);

      if (!selectedUser && fetchedUsers.length > 0) {
        setSelectedChatId(fetchedUsers[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files);
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

    const newMessage: Message = {
      sender: 'Admin',
      content: message.trim(),
      time: new Date().toLocaleTimeString(),
      imageUrls: [],
      isRead: false,
      isAdmin: true
    };

    setUploading(true);

    let uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
      try {
        const uploadPromises = images.map(async (image) => {
          const imageRef = ref(storage, `chats-images/admin/${image.name}`);
          await uploadBytes(imageRef, image);
          const downloadUrl = await getDownloadURL(imageRef);
          return downloadUrl;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);

        setImages(null);
        setImagePreviews([]);

        newMessage.imageUrls = uploadedImageUrls;
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Error uploading images.');
      }
    }

    const updatedMessages = [...selectedUser!.messages, newMessage];
    const chatDocRef = doc(db, 'chats', selectedUser!.id);

    try {
      await updateDoc(chatDocRef, { messages: updatedMessages });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectUser = async (user: User) => {
    setSelectedChatId(user.id);

    const updatedMessages = user.messages.map((msg) => {
      if (!msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });

    const updatedUser = { ...user, messages: updatedMessages };

    try {
      const chatRef = doc(db, 'chats', user.id);
      await updateDoc(chatRef, { messages: updatedMessages });

      const updatedUsers = users.map((u: User) =>
        u.id === user.id ? updatedUser : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const filteredUsers = users.filter((u: User) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  };

  return (
    <Layout title={t('admin-dashboard')}>
      <div className="flex h-screen bg-gray-100">
        {/* Left side: User list */}
        <div className="w-1/4 bg-white p-4 border-r h-full overflow-y-auto">
          <div className="flex items-center bg-white p-2 rounded-lg shadow">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder={t('search-users')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-full outline-none text-sm"
            />
          </div>

          <div className="mt-4 flex flex-col">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <div
                  key={user.id}
                  className={`p-4 bg-white my-2 rounded-lg shadow cursor-pointer ${
                    selectedUser?.id === user.id ? 'bg-gray-300' : ''
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h2 className="font-semibold text-black">
                        {t('order')} ID: {user.id.slice(0, 5)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>

                      {user.messages.some((msg) => !msg.isRead) &&
                        selectedChatId !== user.id && (
                          <p className="text-sm text-red-500 font-semibold">
                            {t('new-messages')}
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

        {/* Right side: Chat Area */}
        <div className="w-3/4 flex flex-col bg-gray-50 h-full">
          {selectedUser ? (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedUser.messages.length > 0 ? (
                  selectedUser.messages.map((msg: Message, index: number) => (
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
                        {msg.imageUrls && msg.imageUrls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {msg.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Sent image ${i + 1}`}
                                className="rounded-lg max-w-xs"
                              />
                            ))}
                          </div>
                        )}

                        {msg.content && <p>{msg.content}</p>}

                        <span className="text-xs text-gray-300">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">{t('no-messages')}</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-gray-500">{t('select-user-text')}</h2>
            </div>
          )}
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 bg-white shadow flex flex-col z-10">
        {showImagePreviews()}
        <div className="p-4 bg-gray-100 shadow flex items-center sticky bottom-0">
          <label htmlFor="file-upload" className="cursor-pointer">
            <FiPaperclip className="text-gray-500 mr-2" />
          </label>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
    </Layout>
  );
}
