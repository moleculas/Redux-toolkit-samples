import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import formatISO from 'date-fns/formatISO';

//importación acciones
import { selectSelectedLabels } from './labelsSlice';
import { showMessage } from 'app/redux/fuse/messageSlice';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export const getEvents = createAsyncThunk(
  'calendarApp/events/getEvents',
  async (_, { getState, dispatch }) => {
    const user = getState().user;
    try {
      const response = await axios.get('/api/calendar/events/' + user.data.id);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const addEvent = createAsyncThunk(
  'calendarApp/events/addEvent',
  async (newEvent, { getState, dispatch }) => {
    const user = getState().user;
    const formData = new FormData();
    const losDatos = {
      title: newEvent.title,
      allDay: newEvent.allDay,
      start: newEvent.start,
      end: newEvent.end,
      desc: newEvent.extendedProps.desc,
      label: newEvent.extendedProps.label,
      usuario: user.data.id
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.post('/api/calendar/events', formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const updateEvent = createAsyncThunk(
  'calendarApp/events/updateEvent',
  async (event, { dispatch }) => {
    const formData = new FormData();
    const losDatos = {
      title: event.title,
      allDay: event.allDay,
      start: event.start,
      end: event.end,
      desc: event.extendedProps.desc,
      label: event.extendedProps.label
    };
    formData.append("datos", JSON.stringify(losDatos));
    try {
      const response = await axios.put(`/api/calendar/events/${event.id}`, formData);
      const data = await response.data;
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

export const removeEvent = createAsyncThunk(
  'calendarApp/events/removeEvent',
  async (eventId, { dispatch }) => {
    try {
      const response = await axios.delete(`/api/calendar/events/${eventId}`);
      const data = await response.data;
      dispatch(showMessage({ message: data.message, variant: "success" }));
      return data;
    } catch (err) {
      dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
      return;
    };
  });

const eventsAdapter = createEntityAdapter({});

export const {
  selectAll: selectEvents,
  selectIds: selectEventIds,
  selectById: selectEventById,
} = eventsAdapter.getSelectors((state) => state.calendarApp.events);

const eventsSlice = createSlice({
  name: 'calendarApp/events',
  initialState: eventsAdapter.getInitialState({
    eventDialog: {
      type: 'new',
      props: {
        open: false,
        anchorPosition: { top: 200, left: 400 },
      },
      data: null,
    },
  }),
  reducers: {
    openNewEventDialog: {
      prepare: (selectInfo) => {
        const { start, end, jsEvent } = selectInfo;
        console.log('start', start)
        const payload = {
          type: 'new',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    openEditEventDialog: {
      prepare: (clickInfo) => {
        const { jsEvent, event } = clickInfo;
        const { id, title, allDay, start, end, extendedProps } = event;

        const payload = {
          type: 'edit',
          props: {
            open: true,
            anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX },
          },
          data: {
            id,
            title,
            allDay,
            extendedProps,
            start: formatISO(new Date(start)),
            end: formatISO(new Date(end)),
          },
        };
        return { payload };
      },
      reducer: (state, action) => {
        state.eventDialog = action.payload;
      },
    },
    closeNewEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'new',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
    closeEditEventDialog: (state, action) => {
      state.eventDialog = {
        type: 'edit',
        props: {
          open: false,
          anchorPosition: { top: 200, left: 400 },
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getEvents.fulfilled]: eventsAdapter.setAll,
    [addEvent.fulfilled]: eventsAdapter.addOne,
    [updateEvent.fulfilled]: eventsAdapter.upsertOne,
    [removeEvent.fulfilled]: eventsAdapter.removeOne,
  },
});

export const {
  openNewEventDialog,
  closeNewEventDialog,
  openEditEventDialog,
  closeEditEventDialog,
} = eventsSlice.actions;

export const selectFilteredEvents = createSelector(
  [selectSelectedLabels, selectEvents],
  (selectedLabels, events) => {
    return events.filter((item) => selectedLabels.includes(item.extendedProps.label));
  }
);

export const selectEventDialog = ({ calendarApp }) => calendarApp.events.eventDialog;

export default eventsSlice.reducer;
