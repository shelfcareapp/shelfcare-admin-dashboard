import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Chat, Message } from '../../types';
import { convertTimestampToISO } from 'utils/convert-timestamp-to-ISO';

export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  const usersRef = collection(db, 'chats');
  const snapshot = await new Promise<any>((resolve) => {
    onSnapshot(usersRef, (snapshot) => {
      resolve(snapshot);
    });
  });

  const fetchedChats = snapshot.docs.map((doc) => {
    const data = doc.data();
    return convertTimestampToISO({
      id: doc.id,
      ...data
    });
  }) as Chat[];

  const filteredChats = fetchedChats.filter(
    (chat) => chat.messages.length > 0 && chat.isAutoReply !== true
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

  return updatedChatsWithUser;
});

export const updateIsRead = createAsyncThunk(
  'chats/updateIsRead',
  async (chatId: string) => {
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatDocRef);
    const updatedMessages = chatDoc.data().messages.map((message: Message) => ({
      ...message,
      isRead: true
    }));

    await updateDoc(chatDocRef, { messages: updatedMessages });
  }
);

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({
    selectedUserId,
    message,
    images,
    sender
  }: {
    selectedUserId: string;
    message: string;
    images: File[];
    sender?: string;
  }) => {
    const newMessage: Message = {
      sender: 'Admin' || sender,
      content: message.trim(),
      time: new Date().toLocaleTimeString(),
      imageUrls: [],
      isRead: false,
      isAdmin: true
    };

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (image) => {
        const imageRef = ref(storage, `chats-images/admin/${image.name}`);
        await uploadBytes(imageRef, image);
        return getDownloadURL(imageRef);
      });
      newMessage.imageUrls = await Promise.all(uploadPromises);
    }

    const chatDocRef = doc(db, 'chats', selectedUserId);
    const chatDoc = await getDoc(chatDocRef);
    const updatedMessages = [...chatDoc.data().messages, newMessage];

    await updateDoc(chatDocRef, { messages: updatedMessages });

    return { chatId: selectedUserId, newMessage };
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
    searchTerm: ''
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
    setUnreadMessages: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find((chat) => chat.id === action.payload);
      if (chat) {
        chat.messages = chat.messages.map((message) => ({
          ...message,
          isRead: true
        }));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.loading = false;
      })

      .addCase(sendMessage.pending, (state) => {
        state.uploading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, newMessage } = action.payload;
        const chat = state.chats.find((chat) => chat.id === chatId);
        if (chat) {
          chat.messages.push(newMessage);
        }
        state.message = '';
        state.uploading = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.uploading = false;
      })
      .addCase(updateIsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIsRead.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateIsRead.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const {
  setSelectedChatId,
  setMessage,
  setSearchTerm,
  setUnreadMessages
} = chatsSlice.actions;

export default chatsSlice.reducer;
