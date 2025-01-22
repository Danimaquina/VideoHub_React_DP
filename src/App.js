import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './componentes/Sidebar';

// Importación de componentes
import Favoritos from './Pages/Favoritos';
import Listas from './Pages/Listas';
import SubirVideo from './Pages/SubirVideo';
import Register from './Pages/Register';
import Login from './Pages/Login';

// Componente Layout que incluye el Sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';

  return isAuthPage ? (
    children
  ) : (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/subirVideo" element={<SubirVideo />} />
        </Routes>
      </Layout>
    </Router>
  );
}
