import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventos, updateEvento, updateEventoEstado } from '../store/slices/eventoSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import UpdateIcon from '@mui/icons-material/Update';
import MenuIcon from '@mui/icons-material/Menu'; // Icon for opening drawer

const EventoList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const eventos = useSelector((state) => state.evento.eventos);
  const status = useSelector((state) => state.evento.status);
  const error = useSelector((state) => state.evento.error);
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer
  const [currentEvento, setCurrentEvento] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  const eventsPerPage = 5;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEventos());
    }
  }, [status, dispatch]);

  useEffect(() => {
    filterEventos();
  }, [startDate, endDate, eventos, searchQuery]);

  useEffect(() => {
    handleSort();
  }, [filteredEventos, sortOrder]);

  const filterEventos = () => {
    let filtered = eventos.filter(evento => evento.estado);
    if (startDate && endDate) {
      filtered = filtered.filter(evento => {
        const eventoDate = dayjs(evento.fechaEvento).startOf('day');
        return eventoDate.isBetween(startDate, endDate, null, '[]');
      });
    }
    if (searchQuery) {
      filtered = filtered.filter(evento => {
        const query = searchQuery.toLowerCase();
        return evento.descripcionEvento.toLowerCase().includes(query) || evento.lugarEvento.toLowerCase().includes(query);
      });
    }
    setFilteredEventos(filtered);
  };

  const handleClickOpen = (evento) => {
    setCurrentEvento(evento);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEvento(null);
  };

  const handleSave = () => {
    dispatch(updateEvento(currentEvento)).then(() => {
      dispatch(fetchEventos());
      handleClose();
      setAlert({ open: true, message: 'El evento ha sido modificado', severity: 'success' });
  
      setTimeout(() => {
        setAlert({ ...alert, open: false });
      }, 3000);
    }).catch(() => {
      setAlert({ open: true, message: 'Error al guardar los cambios', severity: 'error' });
    });
  };

  const handleUpdateEstado = (evento) => {
    setCurrentEvento(evento);
    setConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    dispatch(updateEventoEstado({ id: currentEvento.idEvento, estado: !currentEvento.estado }))
      .then(() => {
        dispatch(fetchEventos());
        setConfirmDialogOpen(false);
      })
      .catch(() => setAlert({ open: true, message: 'Error al cambiar el estado', severity: 'error' }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSort = () => {
    const sortedEventos = [...filteredEventos].sort((a, b) => {
      const dateA = new Date(a.fechaEvento);
      const dateB = new Date(b.fechaEvento);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredEventos(sortedEventos);
  };

  const handleMostrarTodos = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchQuery('');
    const eventosActivos = eventos.filter(evento => evento.estado);
    setFilteredEventos(eventosActivos);
    setSortOrder('asc');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEventos.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEventos.length / eventsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getEstadoTexto = (estado) => estado ? 'Activo' : 'Inactivo';

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Botón para abrir el Drawer */}
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      
      {/* Menú Lateral (Drawer) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemText primary="Salir" />
          </ListItem>
        </List>
      </Drawer>
      
      {/* Contenedor Principal */}
      <div style={{ flexGrow: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Eventos</h1>
        {alert.open && <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>{alert.message}</Alert>}
        <Button variant="contained" color="primary" onClick={() => navigate('/crear')}>
          Crear Evento
        </Button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} direction="row" style={{ marginTop: '20px' }}>
            <DatePicker
              label="Fecha de Inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue.startOf('day'))}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Fecha de Fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue.endOf('day'))}
              renderInput={(params) => <TextField {...params} />}
            />
            <TextField
              label="Buscar (Descripción o Lugar)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
            <Button variant="contained" color="secondary" onClick={handleMostrarTodos}>
              Mostrar Todos
            </Button>
          </Stack>
        </LocalizationProvider>

        <TableContainer component={Paper} style={{ marginTop: '20px', width: '80%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Fecha del Evento
                  <IconButton onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    handleSort();
                  }}>
                    {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>Evento</TableCell>
                <TableCell>Lugar</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentEvents.map((evento) => (
                <TableRow key={evento.idEvento}>
                  <TableCell>{formatDate(evento.fechaEvento)}</TableCell>
                  <TableCell>{evento.descripcionEvento}</TableCell>
                  <TableCell>{evento.lugarEvento}</TableCell>
                  <TableCell>{evento.precio}</TableCell>
                  <TableCell>{getEstadoTexto(evento.estado)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleClickOpen(evento)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleUpdateEstado(evento)}>
                      <UpdateIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Stack>

        {/* Diálogo para Editar Evento */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Modificar Evento</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Descripción"
              type="text"
              fullWidth
              variant="outlined"
              value={currentEvento?.descripcionEvento || ''}
              onChange={(e) => setCurrentEvento({ ...currentEvento, descripcionEvento: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Lugar"
              type="text"
              fullWidth
              variant="outlined"
              value={currentEvento?.lugarEvento || ''}
              onChange={(e) => setCurrentEvento({ ...currentEvento, lugarEvento: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Precio"
              type="text"
              fullWidth
              variant="outlined"
              value={currentEvento?.precio || ''}
              onChange={(e) => setCurrentEvento({ ...currentEvento, precio: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Fecha"
              type="date"
              fullWidth
              variant="outlined"
              value={currentEvento ? formatDate(currentEvento.fechaEvento) : ''}
              onChange={(e) => setCurrentEvento({ ...currentEvento, fechaEvento: e.target.value })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSave} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de confirmación para cambiar estado */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Cambiar Estado</DialogTitle>
          <DialogContent>
            ¿Estás seguro de que deseas cambiar el estado de este evento?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmUpdate} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default EventoList;
