import {
  createSlice,
} from '@reduxjs/toolkit';

const initialState = {
  usuario: {},
};

const registrarUsuarioSlice = createSlice({
  name: 'registrarUsuario',
  initialState,
  reducers: {
    setUsuarioRegistrado: (state, action) => {
      state.usuario = action.payload;
    },
  },
});

export const { setUsuarioRegistrado } = registrarUsuarioSlice.actions;

// Reducer
export default registrarUsuarioSlice.reducer;
