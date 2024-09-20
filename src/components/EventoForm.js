import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crearEvento, fetchEventos } from '../store/slices/eventoSlice';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography, Container } from '@mui/material';

const EventoForm = () => {
  const dispatch = useDispatch();
  const eventosStatus = useSelector((state) => state.evento.status);
  const [evento, setEvento] = useState({
    fechaEvento: '',
    lugarEvento: '',
    descripcionEvento: '',
    precio: '',
    estado: false // Agregamos el estado aquí
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setEvento({
      ...evento,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setEvento({
      ...evento,
      estado: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventoConPrecioFormateado = {
      ...evento,
      precio: evento.precio.replace('.', ','), // Formatea el precio antes de enviar
    };
    
    dispatch(crearEvento(eventoConPrecioFormateado)).then(() => {
      setEvento({
        fechaEvento: '',
        lugarEvento: '',
        descripcionEvento: '',
        precio: '',
        estado: false,
      });
      navigate('/eventos');
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Crear Evento
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Fecha del Evento"
            type="date"
            name="fechaEvento"
            value={evento.fechaEvento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            label="Lugar del Evento"
            type="text"
            name="lugarEvento"
            value={evento.lugarEvento}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Descripción del Evento"
            name="descripcionEvento"
            value={evento.descripcionEvento}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
          />
          <TextField
            label="Precio"
            type="text" // Cambiado de number a text
            name="precio"
            value={evento.precio}
            onChange={handleChange}
            fullWidth
            required
          />

          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={evento.estado} onChange={handleCheckboxChange} />}
              label="Estado"
            />
          </FormGroup>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={eventosStatus === 'loading'}
          >
            {eventosStatus === 'loading' ? 'Creando...' : 'Crear Evento'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/eventos')}
          >
            Volver a la Lista de Eventos
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default EventoForm;
