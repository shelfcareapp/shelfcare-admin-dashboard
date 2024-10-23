import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectableUser } from 'types';

interface UserSelectionState {
  selectedUser: SelectableUser | null;
}

const initialState: UserSelectionState = {
  selectedUser: null
};

const userSelectionSlice = createSlice({
  name: 'userSelection',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<SelectableUser | null>) => {
      state.selectedUser = action.payload;
    }
  }
});

export const { setSelectedUser } = userSelectionSlice.actions;
export const selectSelectedUser = (state: any) =>
  state.userSelection.selectedUser;

export default userSelectionSlice.reducer;
