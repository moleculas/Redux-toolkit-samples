import { combineReducers } from '@reduxjs/toolkit';
import userPanelSlice from './userPanelSlice';

const reducer = combineReducers({ 
  userPanelSlice,
});
export default reducer;
