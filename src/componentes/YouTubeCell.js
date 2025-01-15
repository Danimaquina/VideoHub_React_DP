import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";  // Si no lo tienes, instálalo con `npm install moment`

const YouTubeCell = ({ videoUrl, initialTitle = "", onToggleWatched, fechaCreacion }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState(false);
  const [isWatched, setIsWatched] = useState(false); // Estado para marcar como visto

  const toggleWatched = () => {
    setIsWatched(prevState => !prevState); // Alternar el estado de visto
  };

  const getVideoId = (url) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\?v=|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const fetchThumbnail = (videoId) => {
    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg;`
      setThumbnail(thumbnailUrl);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const videoId = getVideoId(videoUrl);
    fetchThumbnail(videoId);
  }, [videoUrl]);

  const handleStateChange = useCallback((state) => {
    if (state === "ended") {
      setIsPlaying(false);
      alert("El video ha terminado");
    }
  }, []);

  // Formatear la fecha de creación
  const formattedDate = moment(fechaCreacion?.toDate()).format('DD/MM/YYYY');  // Asegúrate de convertir a un formato legible

  return (
    <div className="cell-container">
      {error ? (
        <div className="error-container">
          <p className="error-text">Error: URL no válida</p>
        </div>
      ) : (
        <button className="thumbnail-button" onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnail}
            alt="thumbnail"
            className="thumbnail"
          />
        </button>
      )}

      <div className="details-container">
        <input
          className="title-input"
          placeholder="Escribe un título..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Mostrar la fecha de creación */}
        <p className="date-text">Fecha de creación: {formattedDate}</p>

        <button
          className={`watched-button ${isWatched ? "watched-active" : ""}`}
          onClick={() => {
            toggleWatched();
            onToggleWatched();
          }}
        >
          {isWatched ? 'Visto' : 'Marcar como Visto'}
        </button>
      </div>

      {isPlaying && (
        <div className="modal-background">
          <iframe
            title="youtube-video"
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <button
            className="close-button"
            onClick={() => setIsPlaying(false)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeCell;
