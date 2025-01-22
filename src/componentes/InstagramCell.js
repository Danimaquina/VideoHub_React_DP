import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap'; // Usamos react-bootstrap para el modal
import moment from 'moment'; // Para manejar y formatear fechas
import { useNavigate } from 'react-router-dom'; // Cambiado de useHistory a useNavigate
import './InstagramCell.css'; // Importamos el archivo CSS para los estilos

const InstagramCell = ({ videoUrl, initialTitle = '', onToggleWatched, fechaCreacion }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const navigate = useNavigate(); // Cambiado de useHistory a useNavigate

  const toggleWatched = () => {
    setIsWatched((prevState) => !prevState); // Alternar el estado de visto
  };

  const isValidInstagramUrl = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]{11})/;
    return regExp.test(url);
  };

  const normalizeUrl = (url) => {
    if (url.includes('instagram://') || url.includes('iglite://')) {
      return url.replace(/^(instagram:\/\/|iglite:\/\/)/, 'https://www.instagram.com/');
    }
    return url;
  };

  const fetchVideoUrl = (url) => {
    if (isValidInstagramUrl(url)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    fetchVideoUrl(videoUrl);
  }, [videoUrl]);

  const openVideoInBrowser = () => {
    window.open(normalizeUrl(videoUrl), '_blank'); // Cambiado para abrir en nueva pestaña
    setIsVideoVisible(false);
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
        <button onClick={() => setIsVideoVisible(true)} className="thumbnail-button">
          <img
            src="../assets/1.png"
            alt="Thumbnail"
            className="thumbnail"
          />
        </button>
      )}

      <div className="details-container">
        <p className="title-text">{title}</p>
        <p className="date-text">Fecha de creación: {formattedDate}</p>

        <button
          className={`watched-button ${isWatched ? 'watched-active' : ''}`}
          onClick={() => {
            toggleWatched();
            onToggleWatched();
          }}
        >
          {isWatched ? 'Visto' : 'Marcar como Visto'}
        </button>
      </div>

      <Modal show={isVideoVisible} onHide={() => setIsVideoVisible(false)}>
        <Modal.Body className="modal-background">
          <button
            onClick={() => setIsVideoVisible(false)}
            className="close-button"
          >
            Cerrar
          </button>
          <button onClick={openVideoInBrowser} className="open-in-browser-text">
            Abrir en navegador
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InstagramCell;
