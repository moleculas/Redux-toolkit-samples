import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getContacts = createAsyncThunk(
  'chatApp/contacts/getContacts',
  async (params, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/api/chat/users', { params });
      const data = await response.data;
      const filteredData = data.filter(function (usuario) {
        return usuario.usuario !== user.data.id;
      });
      return filteredData;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactById } =
  contactsAdapter.getSelectors((state) => state.chatApp.contacts);

const contactsSlice = createSlice({
  name: 'chatApp/contacts',
  initialState: contactsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getContacts.fulfilled]: contactsAdapter.setAll,
  },
});

export default contactsSlice.reducer;
