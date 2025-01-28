import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SubirVideo = () => {
  const [enlace, setEnlace] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('YouTube');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [listas, setListas] = useState([]);
  const [listasSeleccionadas, setListasSeleccionadas] = useState([]);

  useEffect(() => {
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
          console.log('Listas cargadas:', listasData); // Para debugging
          setListas(listasData);
        }
      } catch (error) {
        console.error('Error al cargar las listas:', error);
      }
    };
    
    fetchListas();
  }, []);

  const detectarTipoVideo = (url) => {
    const youtubeRegExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|v\/|embed\/))([a-zA-Z0-9_-]{11})/;
    const instagramRegExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/;

    if (youtubeRegExp.test(url)) {
      return 'YouTube';
    } else if (instagramRegExp.test(url)) {
      return 'Instagram';
    }
    return null;
  };

  const handleEnlaceChange = (e) => {
    const nuevoEnlace = e.target.value;
    setEnlace(nuevoEnlace);
    
    const tipoDetectado = detectarTipoVideo(nuevoEnlace);
    if (tipoDetectado) {
      setTipo(tipoDetectado);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!auth.currentUser) {
        throw new Error('Debes iniciar sesión para subir videos');
      }

      if (!enlace.trim() || !titulo.trim()) {
        throw new Error('Por favor, completa todos los campos');
      }

      const videoData = {
        enlace: enlace.trim(),
        titulo: titulo.trim(),
        tipo,
        usuario: auth.currentUser.uid,
        fechaCreacion: new Date(),
        visto: false
      };

      const videoRef = await addDoc(collection(db, 'videos'), videoData);

      const actualizacionesListas = listasSeleccionadas.map(listaId => {
        const listaRef = doc(db, 'listas', listaId);
        return updateDoc(listaRef, {
          contenido: arrayUnion(videoRef.id)
        });
      });

      await Promise.all(actualizacionesListas);
      navigate('/favoritos');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Subir Nuevo Video</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipo de Video</label>
            <select 
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                ...styles.select,
                backgroundColor: tipo ? '#f0f0f0' : 'white',
                cursor: 'default'
              }}
              disabled={true}
            >
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Enlace del Video</label>
            <input
              type="text"
              value={enlace}
              onChange={handleEnlaceChange}
              placeholder="Ingresa el enlace del video"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ingresa el título del video"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Agregar a listas</label>
            <div style={styles.listasContainer}>
              {listas.length > 0 ? (
                listas.map(lista => (
                  <label key={lista.id} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={listasSeleccionadas.includes(lista.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setListasSeleccionadas([...listasSeleccionadas, lista.id]);
                        } else {
                          setListasSeleccionadas(
                            listasSeleccionadas.filter(id => id !== lista.id)
                          );
                        }
                      }}
                      style={styles.checkbox}
                    />
                    <span style={styles.checkboxText}>{lista.title}</span>
                  </label>
                ))
              ) : (
                <p style={styles.noListas}>No hay listas disponibles</p>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Subiendo...' : 'Subir Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    marginLeft: '250px',
    marginTop: '-50px',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '12px',
    borderRadius: '6px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    padding: '12px',
    backgroundColor: '#00910e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
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
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  checkbox: {
    cursor: 'pointer',
    width: '16px',
    height: '16px',
  },
  checkboxText: {
    color: '#333',
    fontSize: '14px',
  },
  noListas: {
    color: '#666',
    fontStyle: 'italic',
    padding: '10px',
    textAlign: 'center',
  },
};

export default SubirVideo;
