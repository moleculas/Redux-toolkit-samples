import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getItems = createAsyncThunk(
  'fileManagerApp/items/getItems',
  async (folderId) => {
    !folderId && (folderId = 'root');
    try {
      const response = await axios.get(`/api/files/${folderId}`);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const addFile = createAsyncThunk(
  'fileManagerApp/items/addFile',
  async (file, { getState, dispatch }) => {
    const formData = new FormData();
    let losDatos = {
      name: file.name,
      nameServer: file.nameServer,
      folderId: file.folderId,
      createdBy: file.createdBy,
      size: file.size,
      type: file.type,
      description: file.description,
      ruta: file.ruta,
    };
    formData.append("datos", JSON.stringify(losDatos));
    if (file.file) {
      formData.append("file", file.file);
    };
    let ruta;
    file.type === 'folder' ? (ruta = '/api/files/folder') : (ruta = '/api/files/file');
    try {
      const response = await axios.post(ruta, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateFile = createAsyncThunk(
  'fileManagerApp/items/updateFile',
  async (file, { getState, dispatch }) => {
    const formData = new FormData();
    let losDatos = {
      name: file.name,
      nameServer: file.nameServer,
      folderId: file.folderId,
      createdBy: file.createdBy,
      size: file.size,
      type: file.type,
      description: file.description,
      ruta: file.ruta,
    };
    formData.append("datos", JSON.stringify(losDatos));
    if (file.file) {
      formData.append("file", file.file);
    };
    let ruta;
    file.type === 'folder' ? (ruta = `/api/files/folder/${file.id}`) : (ruta = `/api/files/file/${file.id}`);
    try {
      const response = await axios.put(ruta, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const removeFile = createAsyncThunk(
  'fileManagerApp/items/removeFile',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.delete(`/api/files/${id}`);
      const data = await response.data;
      dispatch(showMessage({ message: data.message, variant: "success" }));
      dispatch(getItems());
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const itemsAdapter = createEntityAdapter({});

export const {
  selectAll: selectItems,
  selectEntities: selectItemsEntities,
  selectById: selectItemById,
} = itemsAdapter.getSelectors((state) => state.fileManagerApp.items);

const itemsSlice = createSlice({
  name: 'fileManagerApp/items',
  initialState: itemsAdapter.getInitialState({
    path: [],
    selectedItemId: null,
    selectedButton: null,
    selectedItemAEditar: null,
    fileAActualizar: null
  }),
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItemId = action.payload;
    },
    setSelectedButton: (state, action) => {
      state.selectedButton = action.payload;
    },
    setSelectedItemAEditar: (state, action) => {
      state.selectedItemAEditar = action.payload;
    },
    setFileAActualizar: (state, action) => {
      state.fileAActualizar = action.payload;
    },
  },
  extraReducers: {
    [getItems.fulfilled]: (state, action) => {
      const { items, path } = action.payload;
      itemsAdapter.setAll(state, items);
      state.path = path;
      state.selectedItemId = null;
      state.selectedButton = null;
      state.selectedItemAEditar = null;
      state.fileAActualizar = null;
    },
    [addFile.fulfilled]: itemsAdapter.addOne,
    [updateFile.fulfilled]: itemsAdapter.upsertOne,
    [removeFile.fulfilled]: itemsAdapter.removeOne,
  },
});

export const selectFolders = createSelector([selectItems], (items) => {
  return items.filter((item) => item.type === 'folder');
});

export const selectFiles = createSelector([selectItems], (items) => {
  return items.filter((item) => item.type !== 'folder');
});

export const selectSelectedItem = ({ fileManagerApp }) => fileManagerApp.items.selectedItemId;
export const selectSelectedButton = ({ fileManagerApp }) => fileManagerApp.items.selectedButton;
export const selectSelectedItemAEditar = ({ fileManagerApp }) => fileManagerApp.items.selectedItemAEditar;
export const selectPath = ({ fileManagerApp }) => fileManagerApp.items.path;
export const fileAActualizar = ({ fileManagerApp }) => fileManagerApp.items.fileAActualizar;

export const {
  setSelectedItem,
  setSelectedButton,
  setSelectedItemAEditar,
  setFileAActualizar
} = itemsSlice.actions;

export default itemsSlice.reducer;
