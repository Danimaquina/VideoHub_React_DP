import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaUpload, FaList, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link to="/favoritos" className={`menuItem ${location.pathname === '/favoritos' ? 'active' : ''}`}>
        <FaHeart size={24} />
        <span>Favoritos</span>
      </Link>
      
      <Link to="/subirVideo" className={`menuItem ${location.pathname === '/subirVideo' ? 'active' : ''}`}>
        <FaUpload size={24} />
        <span>Subir Video</span>
      </Link>
      
      <Link to="/listas" className={`menuItem ${location.pathname === '/listas' ? 'active' : ''}`}>
        <FaList size={24} />
        <span>Listas</span>
      </Link>

      <Link to="/logOut" className={`menuItem ${location.pathname === '/logOut' ? 'active' : ''}`}>
        <FaSignOutAlt size={24} />
        <span>Log Out</span>
      </Link>
    </div>
  );
};

const Favoritos = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const data = querySnapshot.docs.map(doc => doc.data());
      setItems(data);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="mainContent">
        <h2>Items desde Firestore</h2>
        <ul>
          {items.map((video, index) => (
            <li key={index}>{video.titulo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Favoritos;
