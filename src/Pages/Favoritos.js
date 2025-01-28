import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import YouTubeCell from '../componentes/YouTubeCell';
import InstagramCell from '../componentes/InstagramCell';

const Favoritos = () => {
  const [videos, setVideos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'vistos', 'noVistos'

  useEffect(() => {
    const fetchVideos = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'videos'),
          where('usuario', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const videosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVideos(videosData);
      }
    };
    
    fetchVideos();
  }, []);

  const videosFiltrados = videos.filter(video => {
    switch (filtro) {
      case 'vistos':
        return video.visto === true;
      case 'noVistos':
        return video.visto === false;
      default:
        return true;
    }
  });

  const handleToggleWatched = async (videoId) => {
    try {
      // Encontrar el video actual en el estado
      const videoActual = videos.find(v => v.id === videoId);
      
      // Referencia al documento en Firestore
      const videoRef = doc(db, 'videos', videoId);
      
      // Actualizar en Firestore
      await updateDoc(videoRef, {
        visto: !videoActual.visto
      });

      // Actualizar el estado local
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, visto: !video.visto }
          : video
      ));
    } catch (error) {
      console.error('Error al actualizar el estado del video:', error);
      alert('Error al actualizar el estado del video. Por favor, inténtalo de nuevo.');
    }
  };

  const renderVideoCell = (video) => {
    const commonProps = {
      enlace: video.enlace,
      titulo: video.titulo,
      visto: video.visto,
      fechaCreacion: video.fechaCreacion,
      onToggleWatched: () => handleToggleWatched(video.id)
    };

    return video.tipo === 'YouTube' ? (
      <YouTubeCell {...commonProps} />
    ) : (
      <InstagramCell {...commonProps} />
    );
  };

  return (
    <div className="container">
      <div className="filtros-container" style={styles.filtrosContainer}>
        <button 
          onClick={() => setFiltro('todos')}
          style={{
            ...styles.filtroBoton,
            backgroundColor: filtro === 'todos' ? '#00910e' : 'white',
            color: filtro === 'todos' ? 'white' : 'black'
          }}
        >
          Todos
        </button>
        <button 
          onClick={() => setFiltro('vistos')}
          style={{
            ...styles.filtroBoton,
            backgroundColor: filtro === 'vistos' ? '#00910e' : 'white',
            color: filtro === 'vistos' ? 'white' : 'black'
          }}
        >
          Vistos
        </button>
        <button 
          onClick={() => setFiltro('noVistos')}
          style={{
            ...styles.filtroBoton,
            backgroundColor: filtro === 'noVistos' ? '#00910e' : 'white',
            color: filtro === 'noVistos' ? 'white' : 'black'
          }}
        >
          No Vistos
        </button>
      </div>

      <div className="videos-grid" style={styles.videosGrid}>
        {videosFiltrados.map((video) => (
          <div key={video.id}>
            {renderVideoCell(video)}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  filtrosContainer: {
    display: 'flex',
    gap: '10px',
    position: 'absolute',
    top: '25px',
    left: '725px',
    right: '0',
    zIndex: 1,
    padding: '10px',
  },
  filtroBoton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'black',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '2px solid black',

  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px',
    maxWidth: '1400px',
    margin: '100px 100px 350px 50px',
  }
};

export default Favoritos;
