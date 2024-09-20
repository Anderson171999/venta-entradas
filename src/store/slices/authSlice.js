import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const iniciarSesion = createAsyncThunk('auth/iniciarSesion', async ({ usuario, clave }, thunkAPI) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuario/IniciarSesion`, {
      params: { usuario, clave },
    });
    return response.data.value; // Retorna el usuario
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg || error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(iniciarSesion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
