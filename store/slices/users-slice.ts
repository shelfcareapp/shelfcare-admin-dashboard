import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { SelectableUser } from 'types';
import { convertTimestampToISO } from 'utils/convert-timestamp-to-ISO';

interface UsersState {
  users: SelectableUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
};

export const fetchNonAdminUsers = createAsyncThunk(
  'users/fetchNonAdminUsers',
  async () => {
    const usersSnapshot = await getDocs(query(collection(db, 'users')));

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      delete data.birthday;
      return convertTimestampToISO({
        id: doc.id,
        ...data
      });
    });

    const filteredUsers = users
      .filter((user) => user.email && !user.isAdmin)
      .reduce((unique, user) => {
        if (!unique.some((u) => u.email === user.email)) {
          unique.push(user);
        }
        return unique;
      }, []);

    return filteredUsers as SelectableUser[];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNonAdminUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNonAdminUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchNonAdminUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });
  }
});

export const selectUsers = (state: any) => state.users.users;
export const selectUsersLoading = (state: any) => state.users.loading;
export const selectUsersError = (state: any) => state.users.error;

export default usersSlice.reducer;
