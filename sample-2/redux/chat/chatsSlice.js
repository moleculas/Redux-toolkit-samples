import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getChats = createAsyncThunk(
  'chatApp/chats/getChats',
  async (_, { dispatch, getState }) => {
    //retorna tots els chats
    const usuarioChat = getState().chatApp.user;
    const formData = new FormData();
    const losDatos = { usuarioChat: usuarioChat.id };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/api/chat/chats', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const chatsAdapter = createEntityAdapter({});

export const { selectAll: selectChats, selectById: selectChatById } = chatsAdapter.getSelectors(
  (state) => state.chatApp.chats
);

const chatsSlice = createSlice({
  name: 'chatApp/chats',
  initialState: chatsAdapter.getInitialState(),
  extraReducers: {
    [getChats.fulfilled]: chatsAdapter.setAll,
  },
});

export default chatsSlice.reducer;
