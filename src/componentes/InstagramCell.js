import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; // Usamos react-bootstrap para el modal
import moment from 'moment'; // Para manejar y formatear fechas
import { useNavigate } from 'react-router-dom'; // Cambiado de useHistory a useNavigate
import './InstagramCell.css'; // Importamos el archivo CSS para los estilos

const InstagramCell = ({ enlace, titulo, visto, onToggleWatched, fechaCreacion }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(visto);
  const navigate = useNavigate(); // Cambiado de useHistory a useNavigate

  // Actualizar isWatched cuando cambia la prop visto
  useEffect(() => {
    setIsWatched(visto);
  }, [visto]);

  const toggleWatched = () => {
    setIsWatched(prevState => !prevState);
  };

  const isValidInstagramUrl = (url) => {
    if (!url) return false;
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/;
    return regExp.test(url);
  };

  const normalizeUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://www.instagram.com/${url}`;
  };

  useEffect(() => {
    setError(!isValidInstagramUrl(enlace));
  }, [enlace]);

  const openInstagramLink = () => {
    window.open(normalizeUrl(enlace), '_blank');
  };

  // Formatear la fecha de creación
  const formattedDate = moment(fechaCreacion?.toDate()).format('DD/MM/YYYY');

  return (
    <div className="cell-container">
      {error ? (
        <div className="error-container">
          <p className="error-text">Error: URL no válida</p>
        </div>
      ) : (
        <button onClick={openInstagramLink} className="thumbnail-button instagram-placeholder">
          <div className="instagram-icon">
            <i className="fab fa-instagram"></i>
            <span>Ver en Instagram</span>
          </div>
        </button>
      )}

      <div className="details-container">
        <p className="title-text">{titulo || 'Sin título'}</p>
        <p className="date-text">Fecha de creación: {formattedDate}</p>
        <button
          className={`watched-button ${isWatched ? 'watched-active' : ''}`}
          onClick={() => {
            setIsWatched(!isWatched); // Actualizar estado local inmediatamente
            onToggleWatched(); // Llamar a la función del padre
          }}
        >
          {isWatched ? 'Visto' : 'Marcar como Visto'}
        </button>
      </div>
    </div>
  );
};

export default InstagramCell;
