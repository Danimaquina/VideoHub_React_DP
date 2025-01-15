import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '../componentes/Sidebar';

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
