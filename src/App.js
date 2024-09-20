import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventoList from './components/EventoList';
import EventoForm from './components/EventoForm';
import Login from './components/Login'; // Importa el componente de Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear" element={<EventoForm />} />
        <Route path="/eventos" element={<EventoList />} />
      </Routes>
    </Router>
  );
}

export default App;
