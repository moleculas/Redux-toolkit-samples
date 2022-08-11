import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getNotes = createAsyncThunk(
  'notesApp/notes/getNotes',
  async (routeParams, { getState, dispatch }) => {
    const { filter, id } = routeParams;
    const user = getState().user;
    let url;
    if (routeParams.filter === 'labels') {
      url = `/api/notes/labels/${id}/${user.data.id}`;
    };
    if (routeParams.filter === 'archive') {
      url = `/api/notes/archive/` + user.data.id;
    };
    if (routeParams.filter === 'reminders') {
      url = `/api/notes/reminders/` + user.data.id;
    };
    if (!routeParams.filter) {
      url = `/api/notes/` + user.data.id;
    };
    try {
      const response = await axios.get(url);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const createNote = createAsyncThunk(
  'notesApp/notes/createNote',
  async (note, { getState, dispatch }) => {
    const user = getState().user;
    const formData = new FormData();
    let losDatos = {}
    note.title && (losDatos['title'] = note.title);
    note.content && (losDatos['content'] = note.content);
    note.tasks && (losDatos['tasks'] = note.tasks);
    note.reminder && (losDatos['reminder'] = note.reminder);
    note.labels && (losDatos['labels'] = note.labels);
    note.archived ? losDatos['archived'] = note.archived : losDatos['archived'] = false;
    note.image && (losDatos['image'] = note.image);
    losDatos = { ...losDatos, usuario: user.data.id };
    formData.append("datos", JSON.stringify(losDatos));
    if (note.file) {
      formData.append("file", note.file);
    };
    try {
      const response = await axios.post('/api/notes', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateNote = createAsyncThunk(
  'notesApp/notes/updateNote',
  async (note, { dispatch }) => {
    const formData = new FormData();
    let losDatos = {}
    losDatos['title'] = note.title;
    losDatos['content'] = note.content;
    note.tasks && (losDatos['tasks'] = note.tasks);
    note.reminder && (losDatos['reminder'] = note.reminder);
    note.labels && (losDatos['labels'] = note.labels);
    note.archived ? losDatos['archived'] = note.archived : losDatos['archived'] = false;
    note.image && (losDatos['image'] = note.image);
    if (note.file) {
      formData.append("file", note.file);
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.put(`/api/notes/${note.id}`, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const removeNote = createAsyncThunk(
  'notesApp/notes/removeNote',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.delete(`/api/notes/${id}`);
      const data = await response.data;
      dispatch(showMessage({ message: data.message, variant: "success" }));
      dispatch(closeNoteDialog());
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const notesAdapter = createEntityAdapter({});

export const {
  selectAll: selectNotes,
  selectEntities: selectNotesEntities,
  selectById: selectNoteById,
} = notesAdapter.getSelectors((state) => state.notesApp.notes);

const notesSlice = createSlice({
  name: 'notesApp/notes',
  initialState: notesAdapter.getInitialState({
    searchText: '',
    noteDialogId: null,
    variateDescSize: true,
  }),
  reducers: {
    setNotesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    resetNotesSearchText: (state, action) => {
      state.searchText = '';
    },
    openNoteDialog: (state, action) => {
      state.noteDialogId = action.payload;
    },
    closeNoteDialog: (state, action) => {
      state.noteDialogId = action.null;
    },
  },
  extraReducers: {
    [getNotes.fulfilled]: notesAdapter.setAll,
    [createNote.fulfilled]: notesAdapter.addOne,
    [updateNote.fulfilled]: notesAdapter.upsertOne,
    [removeNote.fulfilled]: notesAdapter.removeOne,
  },
});

export const {
  setNotesSearchText,
  resetNotesSearchText,
  openNoteDialog,
  closeNoteDialog,
} = notesSlice.actions;

export const selectSearchText = ({ notesApp }) => notesApp.notes.searchText;

export const selectDialogNoteId = ({ notesApp }) => notesApp.notes.noteDialogId;

export const selectDialogNote = createSelector(
  [selectDialogNoteId, selectNotesEntities],
  (noteId, notesEntities) => {
    return notesEntities[noteId];
  }
);

export default notesSlice.reducer;
