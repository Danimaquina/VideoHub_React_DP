import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Importar el método de registro y actualización de perfil

import { auth } from '../firebase'; // Asegúrate de que la ruta sea correcta
import './Register.css'; // Archivo CSS para estilos

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Usamos el hook useNavigate para la navegación

  const handleRegister = () => {
    if (name && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Actualiza el nombre de usuario en Firebase Authentication
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name, // Guarda el nombre del usuario
          })
            .then(() => {
              navigate('/favoritos'); // Navegar a la página de Favoritos
            })
            .catch((error) => {
              alert("Error", error.message);
            });
        })
        .catch((error) => {
          alert("Error", error.message);
        });
    } else {
      alert('Por favor ingrese todos los campos');
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
          type="text"
          placeholder="Name..."
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email..."
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
        />
        <input
          type="password"
          placeholder="Password..."
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="enterButton" onClick={handleRegister}>
          Register
        </button>
      </div>

      {/* Botón para ir a Login */}
      <button onClick={() => navigate('/')} className="toggleButton">
        Already have an account? Login
      </button>
    </div>
  );
}
