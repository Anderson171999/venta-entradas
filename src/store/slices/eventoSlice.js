import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  eventos: [],
  status: 'idle',
  error: null,
};

export const fetchEventos = createAsyncThunk('evento/fetchEventos', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/evento/Lista`);
  return response.data.value;
});

export const crearEvento = createAsyncThunk('evento/crearEvento', async (evento, thunkAPI) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/evento/Crear`, evento);
    return response.data.value;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg || error.message);
  }
});

export const updateEvento = createAsyncThunk('evento/updateEvento', async (evento) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/evento/Editar`, evento);
    return response.data.value;
  });

  export const updateEventoEstado = createAsyncThunk('evento/updateEventoEstado', async ({ id, estado }) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/evento/${id}/actualizar-estado`, { Estado: estado });
    return response.data.value;
  });
  
  

const eventoSlice = createSlice({
  name: 'evento',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEventos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.eventos = action.payload;
      })
      .addCase(fetchEventos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(crearEvento.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(crearEvento.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.eventos.push(action.payload);
      })
      .addCase(crearEvento.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default eventoSlice.reducer;
