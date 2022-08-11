import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import SectionModel from '../../main/apps/tasks/model/SectionModel';
import TaskModel from '../../main/apps/tasks/model/TaskModel';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getTask = createAsyncThunk(
  'tasksApp/task/getTask',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(`/api/tasks/task/${id}`);
      const data = await response.data;
      return data;
    } catch (error) {
      history.push({ pathname: `/apps/tasks` });
      return null;
    }
  });

export const addTask = createAsyncThunk(
  'tasksApp/tasks/addTask',
  async (task, { dispatch, getState }) => {
    const user = getState().user;
    const formData = new FormData();
    const losDatos = {
      title: task.title,
      type: task.type,
      notes: task.notes,
      completed: task.completed,
      dueDate: task.dueDate,
      priority: task.priority,
      tags: task.tags,
      order: task.order,
      usuario: user.data.id
    };
    formData.append("datos", JSON.stringify(losDatos));
    const response = await axios.post('/api/tasks', formData);
    const data = await response.data;
    return data;
  });

export const updateTask = createAsyncThunk(
  'tasksApp/tasks/updateTask',
  async (task, { dispatch }) => {
    const formData = new FormData();
    const losDatos = {
      title: task.title,
      type: task.type,
      notes: task.notes,
      completed: task.completed,
      dueDate: task.dueDate,
      priority: task.priority,
      tags: task.tags,
      order: task.order
    };
    formData.append("datos", JSON.stringify(losDatos));
    const response = await axios.put(`/api/tasks/${task.id}`, formData);
    const data = await response.data;
    return data;
  });

export const removeTask = createAsyncThunk(
  'tasksApp/tasks/removeTask',
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`/api/tasks/task/${id}`);
    await response.data;
    dispatch(showMessage({ message: response.data.message, variant: "success" }));
    return id;
  });

export const selectTask = ({ tasksApp }) => tasksApp.task;

const taskSlice = createSlice({
  name: 'tasksApp/task',
  initialState: null,
  reducers: {
    newTask: (state, action) => {
      const type = action.payload;
      if (type === 'section') {
        return SectionModel();
      }
      if (type === 'task') {
        return TaskModel();
      }
      return null;
    },
    resetTask: () => null,
  },
  extraReducers: {
    [getTask.pending]: (state, action) => null,
    [getTask.fulfilled]: (state, action) => action.payload,
    [updateTask.fulfilled]: (state, action) => action.payload,
    [removeTask.fulfilled]: (state, action) => null,
  },
});

export const { resetTask, newTask } = taskSlice.actions;

export default taskSlice.reducer;
