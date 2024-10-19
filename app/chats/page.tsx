'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Layout from '@/components/Layout';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { FiPaperclip, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Message, User } from '@/types';

export default function AdminChat() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;

    const newMessage: Message = {
      sender: 'Admin',
      content: message.trim(),
      time: new Date().toLocaleTimeString(),
      imageUrl: null,
      isAdmin: true,
      isRead: true
    };

    try {
      const updatedMessages = [...selectedUser!.messages, newMessage];
      const updatedUser = {
        ...selectedUser!,
        messages: updatedMessages
      };

      const chatRef = doc(db, 'chats', selectedUser!.id);
      await updateDoc(chatRef, {
        messages: updatedMessages
      });

      const updatedUsers = users.map((user: User) =>
        user.id === selectedUser!.id ? updatedUser : user
      );

      setUsers(updatedUsers);
      setNewMessages([...newMessages, newMessage]);
      setMessage('');
      setImage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
      await updateDoc(chatRef, {
        messages: updatedMessages
      });

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

  return (
    <Layout title="Admin Dashboard">
      <div className="flex h-screen bg-gray-100">
        {/* Left side: User list */}
        <div className="w-1/4 bg-white p-4 border-r h-full overflow-y-auto">
          <div className="flex items-center bg-white p-2 rounded-lg shadow">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users"
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
                        Order ID: {user.id.slice(0, 5)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>

                      {user.messages.some((msg) => !msg.isRead) &&
                        selectedChatId !== user.id && (
                          <p className="text-sm text-red-500 font-semibold">
                            Unread messages
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found.</p>
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
                        {msg.imageUrl && (
                          <Image
                            src={msg.imageUrl}
                            alt="Sent image"
                            width={200}
                            height={200}
                            className="mb-2 rounded-lg"
                          />
                        )}
                        {msg.content && <p>{msg.content}</p>}
                        <span className="text-xs text-gray-300">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-gray-500">Select a user to start chatting</h2>
            </div>
          )}
        </div>
      </div>

      {/* Chat input */}
      <div className="p-4 bg-gray-100 shadow flex items-center sticky bottom-0">
        <label htmlFor="file-upload" className="cursor-pointer">
          <FiPaperclip className="text-gray-500 mr-2" />
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-200 p-2 rounded-lg outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-primary text-white p-2 rounded-lg"
        >
          <PaperAirplaneIcon className="h-6 w-6 text-white transform -rotate-90" />
        </button>
      </div>
    </Layout>
  );
}
