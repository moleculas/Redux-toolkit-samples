import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from '@lodash';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getLabels = createAsyncThunk(
  'notesApp/labels/getLabels',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/api/notes/labels/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const createLabel = createAsyncThunk(
  'notesApp/labels/createLabel',
  async (newLabel, { getState, dispatch }) => {
    const user = getState().user;
    const formData = new FormData();
    const losDatos = { ...newLabel, usuario: user.data.id };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post(`/api/notes/labels`, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateLabel = createAsyncThunk(
  'notesApp/labels/updateLabel',
  async (label, { getState, dispatch }) => {
    const formData = new FormData();
    const losDatos = label;
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.put(`/api/notes/labels/${label.id}`, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const removeLabel = createAsyncThunk(
  'notesApp/labels/removeLabel',
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`/api/notes/labels/${id}`);
      const data = await response.data;
      dispatch(showMessage({ message: data.message, variant: "success" }));
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const labelsAdapter = createEntityAdapter({});

export const {
  selectAll: selectLabels,
  selectEntities: selectLabelsEntities,
  selectById: selectLabelById,
} = labelsAdapter.getSelectors((state) => state.notesApp.labels);

const labelsSlice = createSlice({
  name: 'notesApp/labels',
  initialState: labelsAdapter.getInitialState({ labelsDialogOpen: false }),
  reducers: {
    openLabelsDialog: (state, action) => {
      state.labelsDialogOpen = true;
    },
    closeLabelsDialog: (state, action) => {
      state.labelsDialogOpen = false;
    },
  },
  extraReducers: {
    [getLabels.fulfilled]: labelsAdapter.setAll,
    [updateLabel.fulfilled]: labelsAdapter.upsertOne,
    [removeLabel.fulfilled]: labelsAdapter.removeOne,
    [createLabel.fulfilled]: labelsAdapter.addOne,
  },
});

export const { openLabelsDialog, closeLabelsDialog } = labelsSlice.actions;

export const selectLabelsDialogOpen = ({ notesApp }) => notesApp.labels.labelsDialogOpen;

export default labelsSlice.reducer;
