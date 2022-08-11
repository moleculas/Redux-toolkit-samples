import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getChats } from './chatsSlice';

//importacion acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    const usuarioChat = getState().chatApp.user;
    const formData = new FormData();
    const losDatos = {
      usuarioChat: usuarioChat.id,
      usuarioChatContacto: contactId
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/api/chat/chat', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async ({ messageText, chatId, contactId }, { dispatch, getState }) => {
    const formData = new FormData();
    const losDatos = {
      messageText: messageText,
      chatId: chatId,
      contactId: contactId,
      timeStamp: Date.now()
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/api/chat/chats/message', formData);
      const data = await response.data;
      dispatch(getChats());
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: [],
  reducers: {
    removeChat: (state, action) => action.payload,
  },
  extraReducers: {
    [getChat.fulfilled]: (state, action) => action.payload,
    [sendMessage.fulfilled]: (state, action) => [...state, action.payload],
  },
});

export const selectChat = ({ chatApp }) => chatApp.chat;

export default chatSlice.reducer;
