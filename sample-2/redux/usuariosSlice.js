import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usuarios: []
};

const usuariosSlice = createSlice({
  name: 'usuariosSlice',
  initialState,
  reducers: {
    setUsuarios(state, action) {
      state.usuarios = action.payload
    },
  },
});

export const { actions } = usuariosSlice;

export const setUsuariosPrev = (usuarios) => (dispatch, getState) => {
  const user = getState().user;
  const arrayFiltrado = usuarios.filter(function (usuario) {
    return usuario._id !== user.data.id;
  });
  dispatch(usuariosSlice.actions.setUsuarios(arrayFiltrado));
};

export default usuariosSlice.reducer;
