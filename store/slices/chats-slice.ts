import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Chat, Message } from '../../types';
import { convertTimestampToISO } from 'utils/convert-timestamp-to-ISO';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';

export const listenToAllChats = () => (dispatch: AppDispatch) => {
  const chatsRef = collection(db, 'chats');

  return onSnapshot(chatsRef, async (snapshot) => {
    const fetchedChats = snapshot.docs.map((doc) => {
      const data = doc.data();
      return convertTimestampToISO({
        id: doc.id,
        ...data
      });
    }) as Chat[];

    const filteredChats = fetchedChats.filter(
      (chat) =>
        Array.isArray(chat.messages) &&
        chat.messages.length > 0 &&
        chat.isAutoReply !== true &&
        chat.userId
    );

    const updatedChatsWithUser = await Promise.all(
      filteredChats.map(async (chat) => {
        const userDocRef = doc(db, 'users', chat.userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            ...chat,
            name: userData.name || 'Unknown User',
            email: userData.email || 'Unknown Email'
          };
        } else {
          return {
            ...chat,
            name: 'Unknown User',
            email: 'Unknown Email'
          };
        }
      })
    );

    const sortedChats = updatedChatsWithUser.sort((a, b) => {
      const aLatestMessage =
        Array.isArray(a.messages) && a.messages.length > 0
          ? (a.messages[a.messages.length - 1] as Message)
          : null;
      const bLatestMessage =
        Array.isArray(b.messages) && b.messages.length > 0
          ? (b.messages[b.messages.length - 1] as Message)
          : null;

      const aTime = aLatestMessage
        ? new Date(aLatestMessage.time).getTime()
        : 0;
      const bTime = bLatestMessage
        ? new Date(bLatestMessage.time).getTime()
        : 0;

      return bTime - aTime;
    });

    const hasNewNotification = sortedChats.some(
      (chat) =>
        Array.isArray(chat.messages) && chat.messages.some((msg) => !msg.isRead)
    );

    dispatch(updateAllChats(sortedChats));
    dispatch(setHasNewNotification(hasNewNotification));
  });
};

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({
    selectedUserId,
    images,
    message,
    sender,
    type,
    options = [],
    orderId
  }: {
    selectedUserId: string;
    message: string;
    images?: string[];
    sender?: string;
    type?: string;
    options?: { label: string; value: string }[];
    orderId?: string;
  }) => {
    try {
      const newMessage: Message = {
        sender: sender || 'Admin',
        content: message.trim(),
        time: new Date().toLocaleTimeString(),
        imageUrls: images || [],
        isRead: false,
        isAdmin: true,
        options,
        type,
        orderId
      };

      const chatDocRef = doc(db, 'chats', selectedUserId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        toast.error('Chat not found. Please try again.');
        return null;
      }

      const currentMessages = chatDoc.data()?.messages || [];
      const updatedMessages = [...currentMessages, newMessage];

      await updateDoc(chatDocRef, {
        messages: updatedMessages,
        lastMessage: message.trim(),
        lastMessageTime: new Date().toISOString()
      });

      return { chatId: selectedUserId, newMessage };
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      throw error;
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [] as Chat[],
    loading: false,
    selectedChatId: null as string | null,
    message: '',
    uploading: false,
    searchTerm: '',
    hasNewNotification: false
  },
  reducers: {
    setSelectedChatId: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    updateAllChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setHasNewNotification(state, action: PayloadAction<boolean>) {
      state.hasNewNotification = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.uploading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        // Don't update the messages here since we're using real-time listeners
        state.message = '';
        state.uploading = false;
      });
  }
});

export const {
  setSelectedChatId,
  setMessage,
  setSearchTerm,
  updateAllChats,
  setHasNewNotification
} = chatsSlice.actions;

export default chatsSlice.reducer;
