import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase'; // Asegúrate de que la ruta sea correcta
import './Login.css'; // Archivo CSS para estilos

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Obtener navigate desde React Router

  const handleLogin = () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/favoritos'); // Navegar a la página de Favoritos
        })
        .catch(() => {
          alert('Correo o contraseña incorrectos');
        });
    } else {
      alert('Por favor ingrese email y contraseña');
    }
  };

  return (
    <div className="container">
      {/* Logo */}
      <div className="header">
        <h1 className="logo">
          Video<span className="hub">HUB</span>
        </h1>
      </div>

      {/* Formulario */}
      <div className="formContainer">
        <input
          type="email"
          placeholder="Email..."
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password..."
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="enterButton" onClick={handleLogin}>
          Enter
        </button>
      </div>

      {/* Botón para ir a Register */}
      <button onClick={() => navigate('/register')} className="toggleButton">
        Don’t have an account? Register
      </button>
    </div>
  );
}
