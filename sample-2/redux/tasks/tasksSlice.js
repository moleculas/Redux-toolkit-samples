import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';
import { addTask, removeTask, updateTask } from './taskSlice';

export const getTasks = createAsyncThunk(
  'tasksApp/tasks/getTasks',
  async (params, { getState }) => {
    const user = getState().user;
    const response = await axios.get('/api/tasks/' + user.data.id);
    const data = await response.data;
    return data;
  });

export const reorderList = createAsyncThunk(
  'tasksApp/tasks/reorder',
  async ({ arr, startIndex, endIndex }, { dispatch, getState }) => {
    const user = getState().user;
    const formData = new FormData();
    let idInicio;
    let nuevoArray = [];
    arr.map((elemento, index) => {
      if (index === startIndex) {
        idInicio = elemento.id;
      } else {
        nuevoArray.push(elemento.id);
      };
    });
    nuevoArray.splice(endIndex, 0, idInicio);
    const losDatos = {
      nuevoArray: nuevoArray,
      usuario: user.data.id
    };
    formData.append("datos", JSON.stringify(losDatos));
    const response = await axios.post('/api/tasks/reorder', formData);
    const data = await response.data;
    dispatch(
      showMessage({
        message: 'Orden de lista guardado',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      })
    );
    return data;
  });

const tasksAdapter = createEntityAdapter({});

export const { selectAll: selectTasks, selectById: selectTasksById } = tasksAdapter.getSelectors(
  (state) => state.tasksApp.tasks
);

export const selectRemainingTasks = createSelector([selectTasks], (tasks) => {
  return tasks.filter((item) => item.type === 'task' && !item.completed).length;
});

const tasksSlice = createSlice({
  name: 'tasksApp/tasks',
  initialState: tasksAdapter.getInitialState(),
  extraReducers: {
    [reorderList.fulfilled]: tasksAdapter.setAll,
    [updateTask.fulfilled]: tasksAdapter.upsertOne,
    [addTask.fulfilled]: tasksAdapter.addOne,
    [removeTask.fulfilled]: (state, action) => tasksAdapter.removeOne(state, action.payload),
    [getTasks.fulfilled]: tasksAdapter.setAll,
  },
});

export const { setTasksSearchText } = tasksSlice.actions;

export default tasksSlice.reducer;
