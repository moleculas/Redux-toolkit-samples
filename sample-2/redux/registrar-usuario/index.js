import { combineReducers } from '@reduxjs/toolkit';
import registrarUsuarioSlice from './registrarUsuarioSlice';

const reducer = combineReducers({
    registrarUsuario: registrarUsuarioSlice,
});

export default reducer;
