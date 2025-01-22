import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaUpload, FaList, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowConfirmLogout(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirmLogout(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowConfirmLogout(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'menuItem active' : 'menuItem';
  };

  return (
    <div className="sidebar">
      <Link to="/favoritos" className={isActive('/favoritos')}>
        <FaHeart size={20} />
        <span>Favoritos</span>
      </Link>
      
      <Link to="/subirVideo" className={isActive('/subirVideo')}>
        <FaUpload size={20} />
        <span>Subir Video</span>
      </Link>
      
      <Link to="/listas" className={isActive('/listas')}>
        <FaList size={20} />
        <span>Listas</span>
      </Link>

      <button className="menuItem logoutButton" onClick={handleLogoutClick}>
        <FaSignOutAlt size={20} />
        <span>Cerrar Sesión</span>
      </button>

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
