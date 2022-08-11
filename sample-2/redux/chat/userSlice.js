import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getUserData = createAsyncThunk(
  'chatApp/user/getUserData',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/api/chat/user/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateUserData = createAsyncThunk(
  'chatApp/user/updateUserData',
  async (newData, { getState, dispatch }) => {
    const formData = new FormData();
    const losDatos = { about: newData.about, status: newData.status };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.put(`/api/chat/user/${newData.id}`, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const userSlice = createSlice({
  name: 'chatApp/user',
  initialState: null,
  extraReducers: {
    [getUserData.fulfilled]: (state, action) => action.payload,
    [updateUserData.fulfilled]: (state, action) => action.payload,
  },
});

export const selectUser = ({ chatApp }) => chatApp.user;

export default userSlice.reducer;
