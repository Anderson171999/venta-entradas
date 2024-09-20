import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { iniciarSesion } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Alert, Box } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const handleLogin = () => {
    dispatch(iniciarSesion({ usuario, clave })).then((action) => {
      if (action.type === 'auth/iniciarSesion/fulfilled') {
        navigate('/eventos'); // Redirige a EventoList
      }
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      padding={3}
    >
      <h1>Iniciar Sesión</h1>
      {status === 'failed' && <Alert severity="error">{error}</Alert>}
      <Box sx={{ maxWidth: 400, width: '100%' }}>
        <TextField
          label="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Clave"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Iniciar Sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
