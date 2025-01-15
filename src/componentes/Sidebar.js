import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Usamos Link y useNavigate
import { FaHeart, FaUpload, FaList, FaSignOutAlt } from 'react-icons/fa'; // Iconos
import { useLocation } from 'react-router-dom'; // Para saber cuál es la página activa
import './Sidebar.css'; // Asegúrate de tener este archivo CSS

const Sidebar = () => {
  const location = useLocation(); // Hook para obtener la ruta actual
  const navigate = useNavigate(); // Hook para la redirección
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // Estado para el modal de confirmación

  // Función para manejar el clic en el botón de Log Out
  const handleLogoutClick = () => {
    setShowConfirmLogout(true); // Mostrar el modal de confirmación
  };

  // Función para confirmar el log out
  const handleConfirmLogout = () => {
    setShowConfirmLogout(false); // Ocultar el modal
    navigate('/'); // Redirigir al login
  };

  // Función para cancelar el log out
  const handleCancelLogout = () => {
    setShowConfirmLogout(false); // Solo cerrar el modal
  };

  return (
    <div className="container">
      <div className="sidebar">
        <Link to="/favoritos" className={`menuItem ${location.pathname === '/favoritos' ? 'active' : ''}`}>
          <FaHeart size={24} />
          <span>Favoritos</span>
        </Link>
        
        <Link to="/subirVideo" className={`menuItem ${location.pathname === '/subirVideo' ? 'active' : ''}`}>
          <FaUpload size={24} />
          <span>Subir Video</span>
        </Link>
        
        <Link to="/listas" className={`menuItem ${location.pathname === '/listas' ? 'active' : ''}`}>
          <FaList size={24} />
          <span>Listas</span>
        </Link>

        {/* El botón de Log Out, que muestra el modal */}
        <button className={`menuItem ${location.pathname === '/logOut' ? 'active' : ''}`} onClick={handleLogoutClick}>
          <FaSignOutAlt size={24} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmLogout && (
        <div className="logoutModal">
          <div className="modalContent">
            <h3>¿Estás seguro de que deseas salir?</h3>
            <div className="modalButtons">
              <button onClick={handleCancelLogout} className="cancelButton">Cancelar</button>
              <button onClick={handleConfirmLogout} className="confirmButton">Sí, salir</button>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <h2>Página activa: {location.pathname.split('/').pop()}</h2>
      </div>
    </div>
  );
};

export default Sidebar;
