import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import YouTubeCell from '../componentes/YouTubeCell';
import InstagramCell from '../componentes/InstagramCell';

const Listas = () => {
  const [listas, setListas] = useState([]);
  const [nuevaLista, setNuevaLista] = useState('');
  const [listaSeleccionada, setListaSeleccionada] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [listasConteo, setListasConteo] = useState({});

  useEffect(() => {
    fetchListas();
  }, []);

  const fetchListas = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          collection(db, 'listas'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const listasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListas(listasData);

        // Crear objeto con el conteo de videos por lista
        const conteo = {};
        listasData.forEach(lista => {
          conteo[lista.id] = lista.contenido ? lista.contenido.length : 0;
        });
        setListasConteo(conteo);
      }
    } catch (error) {
      setError('Error al cargar las listas');
      console.error(error);
    }
  };

  const crearLista = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!nuevaLista.trim()) {
        throw new Error('El nombre de la lista no puede estar vacío');
      }

      const listaData = {
        title: nuevaLista.trim(),
        userId: auth.currentUser.uid,
        contenido: [], // Array de IDs de videos
        fechaCreacion: new Date()
      };

      await addDoc(collection(db, 'listas'), listaData);
      setNuevaLista('');
      fetchListas();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideosLista = async (listaId) => {
    setIsLoading(true);
    try {
      const listaRef = doc(db, 'listas', listaId);
      const listaDoc = await getDoc(listaRef);
      
      if (listaDoc.exists()) {
        const listaData = listaDoc.data();
        const videosIds = listaData.contenido;
        
        const videosPromises = videosIds.map(async (videoId) => {
          const videoDoc = await getDoc(doc(db, 'videos', videoId));
          return { id: videoDoc.id, ...videoDoc.data() };
        });

        const videosData = await Promise.all(videosPromises);
        setVideos(videosData);
        setListaSeleccionada(listaId);
      }
    } catch (error) {
      setError('Error al cargar los videos de la lista');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWatched = async (videoId) => {
    try {
      const videoRef = doc(db, 'videos', videoId);
      const videoActual = videos.find(v => v.id === videoId);
      
      await updateDoc(videoRef, {
        visto: !videoActual.visto
      });

      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, visto: !video.visto }
          : video
      ));
    } catch (error) {
      console.error('Error al actualizar el estado del video:', error);
    }
  };

  const handleListaClick = async (listaId) => {
    if (listaId === listaSeleccionada) {
      // Si la lista ya está seleccionada, la cerramos
      setListaSeleccionada(null);
      setVideos([]);
    } else {
      // Si es una lista diferente, la abrimos
      await fetchVideosLista(listaId);
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
    <div className="container" style={styles.container}>
      <div style={styles.createListContainer}>
        <h2 style={styles.title}>Mis Listas de Reproducción</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={crearLista} style={styles.form}>
          <input
            type="text"
            value={nuevaLista}
            onChange={(e) => setNuevaLista(e.target.value)}
            placeholder="Nombre de la nueva lista"
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Creando...' : 'Crear Lista'}
          </button>
        </form>
      </div>

      <div style={styles.listasContainer}>
        {listas.map(lista => (
          <div key={lista.id} style={styles.listaItem}>
            <button
              onClick={() => handleListaClick(lista.id)}
              style={{
                ...styles.listaButton,
                backgroundColor: listaSeleccionada === lista.id ? '#00910e' : 'white',
                color: listaSeleccionada === lista.id ? 'white' : 'black'
              }}
            >
              <span>{lista.title}</span>
              <span style={styles.videoCount}>
                ({listasConteo[lista.id] || 0})
              </span>
            </button>
          </div>
        ))}
      </div>

      {listaSeleccionada && (
        <div className="videos-grid" style={styles.videosGrid}>
          {videos.map((video) => (
            <div key={video.id}>
              {renderVideoCell(video)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    marginLeft: '250px',
  },
  createListContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '6px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#00910e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  listasContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  listaItem: {
    flex: '1 1 200px',
  },
  listaButton: {
    width: '100%',
    padding: '15px',
    border: '2px solid black',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoCount: {
    fontSize: '0.9em',
    opacity: '0.8',
    marginLeft: '10px',
  },
  videosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px',
    maxWidth: '1400px',
  }
};

export default Listas;
