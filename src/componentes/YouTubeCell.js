import React, { useState, useEffect, useCallback } from "react";
import moment from "moment"; 
import YouTube from "react-youtube";
import './YouTubeCell.css';

const YouTubeCell = ({ enlace, titulo, visto, onToggleWatched, fechaCreacion, showRemoveButton, onRemove }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(visto);

  useEffect(() => {
    setIsWatched(visto);
  }, [visto]);

  const getVideoId = (url) => {
    if (!url) return null;
    
    try {
      // Eliminar el @ inicial si existe
      url = url.replace(/^@/, '');
      
      // Expresión regular para ambos formatos
      const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/))([a-zA-Z0-9_-]{11})/;
      const match = url.match(regExp);
      
      // Agregar console.log para depuración
      console.log("URL procesada:", url);
      console.log("Resultado del match:", match);
      
      return match ? match[1] : null;
    } catch (e) {
      console.error("Error al procesar la URL:", e);
      return null;
    }
  };

  const fetchThumbnail = useCallback((videoId) => {
    if (!videoId) {
      setError(true);
      return;
    }
    
    // Intentar cargar la miniatura
    const img = new Image();
    img.onload = () => {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
      setError(false);
    };
    img.onerror = () => {
      setError(true);
    };
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }, []);

  useEffect(() => {
    const videoId = getVideoId(enlace);
    console.log("Video ID extraído:", videoId, "URL original:", enlace);
    
    if (videoId) {
      fetchThumbnail(videoId);
    } else {
      setError(true);
    }
  }, [enlace, fetchThumbnail]);

  const handleStateChange = useCallback((event) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      setIsPlaying(false);
      alert("El video ha terminado");
    }
  }, []);

  return (
    <>
      <div className={`cell-container ${isPlaying ? 'modal-open' : ''}`}>
        <button className="thumbnail-button" onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="thumbnail"
          />
        </button>

        <div className="details-container">
          <p className="title-text">{titulo || 'Sin título'}</p>
          <p className="date-text">Fecha de creación: {moment(fechaCreacion?.toDate()).format('DD/MM/YYYY')}</p>
          <div className="buttons-container">
            <button
              className={`watched-button ${isWatched ? "watched-active" : ""}`}
              onClick={() => {
                setIsWatched(!isWatched);
                onToggleWatched();
              }}
            >
              {isWatched ? 'Visto' : 'Marcar como Visto'}
            </button>
            {showRemoveButton && (
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                Eliminar de la lista
              </button>
            )}
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="modal-background" onClick={(e) => {
          if (e.target.className === 'modal-background') {
            setIsPlaying(false);
          }
        }}>
          <div className="modal-content">
            <YouTube
              videoId={getVideoId(enlace)}
              opts={{
                height: '500',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                },
              }}
              onStateChange={handleStateChange}
            />
            <button
              className="close-button"
              onClick={() => setIsPlaying(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default YouTubeCell;
