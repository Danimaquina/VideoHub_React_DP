import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaUpload, FaList, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowConfirmLogout(true); // Mostrar el modal
  };

  const handleConfirmLogout = () => {
    setShowConfirmLogout(false); // Ocultar el modal
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false); // Ocultar el modal
  };

  return (
    <div className="sidebar">
      <Link to="/favoritos" className="menuItem">
        <FaHeart size={24} />
        <span>Favoritos</span>
      </Link>
      
      <Link to="/subirVideo" className="menuItem">
        <FaUpload size={24} />
        <span>Subir Video</span>
      </Link>
      
      <Link to="/listas" className="menuItem">
        <FaList size={24} />
        <span>Listas</span>
      </Link>

      <button className="menuItem logoutButton" onClick={handleLogoutClick}>
        <FaSignOutAlt size={24} />
        <span>Log Out</span>
      </button>

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
    </div>
  );
};

export default Sidebar;
