import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import YouTubeCell from '../componentes/YouTubeCell';
import InstagramCell from '../componentes/InstagramCell';

const Favoritos = () => {
  const [videos, setVideos] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'vistos', 'noVistos'
  const [showContent, setShowContent] = useState(true);

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

  useEffect(() => {
    // Suscribirse a los cambios del modal
    const handleModalChange = (e) => {
      setShowContent(!e.detail.showModal);
    };

    window.addEventListener('modalStateChange', handleModalChange);

    return () => {
      window.removeEventListener('modalStateChange', handleModalChange);
    };
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
    <div style={styles.container}>
      <h2 style={styles.title}>Favoritos</h2>
      
      <div style={{
        ...styles.filtrosContainer,
        display: showContent ? 'flex' : 'none'
      }}>
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

      <div style={{
        ...styles.videosGrid,
        display: showContent ? 'grid' : 'none'
      }}>
        {videosFiltrados.length > 0 ? (
          videosFiltrados.map((video) => (
            <div key={video.id} style={styles.videoCell}>
              {renderVideoCell(video)}
            </div>
          ))
        ) : (
          <div style={styles.noVideos}>
            No hay videos que mostrar en esta categoría
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 20px',
    backgroundColor: '#00910e',
    minHeight: '100vh',
    marginLeft: '250px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
  },
  filtrosContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#00910e',
    borderRadius: '0px',
    maxWidth: '1800px',
    margin: '0 auto',
  },
  filtroBoton: {
    padding: '10px 25px',
    border: '2px solid white',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '14px',

    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '25px',
    padding: '20px',
    maxWidth: '1800px',
    margin: '0 auto',
    '@media (max-width: 1400px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 1100px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
  videoCell: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    height: '100%',
  },
  noVideos: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  }
};

export default Favoritos;