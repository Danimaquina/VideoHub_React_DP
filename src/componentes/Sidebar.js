import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaUpload, FaList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Añadir este nuevo efecto para manejar el resize de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efecto para controlar la visibilidad de las tarjetas
  useEffect(() => {
    const videosGrid = document.querySelector('.videos-grid');
    const filtrosContainer = document.querySelector('.filtros-container');
    
    if (showConfirmLogout) {
      videosGrid?.classList.add('content-hidden');
      filtrosContainer?.classList.add('content-hidden');
    } else {
      videosGrid?.classList.remove('content-hidden');
      filtrosContainer?.classList.remove('content-hidden');
    }
  }, [showConfirmLogout]);

  useEffect(() => {
    // Emitir evento cuando cambie el estado del modal
    const event = new CustomEvent('modalStateChange', {
      detail: { showModal: showConfirmLogout }
    });
    window.dispatchEvent(event);
  }, [showConfirmLogout]);

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

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button className="toggleButton" onClick={toggleSidebar}>
        <FaBars size={20} />
      </button>
      <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
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
    </>
  );
};

export default Sidebar;
