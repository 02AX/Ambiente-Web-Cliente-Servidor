import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig.js';

// Importar estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Importar controladores
import authController from './controllers/AuthController.js';
import denunciaController from './controllers/DenunciaController.js';

// Importar componentes
import Navigation from './components/Navigation.js';
import Footer from './components/Footer.js';

// Importar páginas
import Inicio from './pages/Inicio.js';
import Denuncias from './pages/Denuncias.js';
import CrearDenuncia from './pages/CrearDenuncia.js';
import DetalleDenuncia from './pages/DetalleDenuncia.js';
import Ranking from './pages/Ranking.js';
import PerfilUsuario from './pages/PerfilUsuario.js';
import Comunidad from './pages/Comunidad.js';
import Soporte from './pages/Soporte.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

// Componente para proteger rutas privadas
const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Componente para redirigir si ya está autenticado (login, register)
const PublicRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);
    // Escuchar cambios de autenticación con Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        authController.currentUser = user;
        authController.isAuthenticated = true;
        setIsAuthenticated(true);
        setCurrentUser(authController._serializeUser(user));
      } else {
        authController.currentUser = null;
        authController.isAuthenticated = false;
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navigation 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />
        
        <main className="main-content">
          <Container fluid="xl">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/denuncias" element={<Denuncias />} />
              <Route path="/denuncias/crear" element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CrearDenuncia />
                </PrivateRoute>
              } />
              <Route path="/denuncias/:id" element={<DetalleDenuncia />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/perfil" element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <PerfilUsuario />
                </PrivateRoute>
              } />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/login" element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <Register />
                </PublicRoute>
              } />
              {/* Ruta catch-all para no encontrados */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
