// src/components/FirestoreExample.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';


const FirestoreExample = () => {
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
    <div>
      <h2>Items desde Firestore</h2>
      <ul>
        {items.map((videos, index) => (
          <li key={index}>{videos.titulo}</li>
        ))}
      </ul>
    </div>
  );
};

export default FirestoreExample;
