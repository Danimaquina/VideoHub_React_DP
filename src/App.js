import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// Importación de componentes
import Favoritos from './Pages/Favoritos';
import Listas from './Pages/Listas';
import SubirVideo from './Pages/SubirVideo';
import Register from './Pages/Register'; // Pantalla de Registro
import Login from './Pages/Login'; // Pantalla de Login




export default function App() {
  return (
    <Router>
      <Routes>
        {/* Definición de rutas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/listas" element={<Listas />} />
        <Route path="/subirVideo" element={<SubirVideo />} />
      </Routes>
    </Router>
  );
}
