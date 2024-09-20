import { configureStore } from '@reduxjs/toolkit';
import eventoReducer from './slices/eventoSlice';
import authReducer from './slices/authSlice'; // Importa el nuevo slice

const store = configureStore({
  reducer: {
    evento: eventoReducer,
    auth: authReducer, // Agrega el nuevo slice al store
  },
});

export default store;
