import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

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
import DevSeed from './pages/DevSeed.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar restaurar sesión al cargar la aplicación
    const sessionRestored = authController.restoreSession();
    
    if (sessionRestored) {
      setIsAuthenticated(true);
      setCurrentUser(authController.getCurrentUser());
    }
    
    setLoading(false);

    // Agregar listener para cambios de autenticación
    const authListener = (authData) => {
      setIsAuthenticated(authData.isAuthenticated);
      setCurrentUser(authData.user);
    };

    authController.addAuthListener(authListener);

    // Cleanup function
    return () => {
      authController.removeAuthListener(authListener);
    };
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
                isAuthenticated ? <CrearDenuncia /> : <Login />
              } />
              <Route path="/denuncias/:id" element={<DetalleDenuncia />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/perfil" element={
                isAuthenticated ? <PerfilUsuario /> : <Login />
              } />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {process.env.NODE_ENV !== 'production' && (
                <Route path="/dev/seed" element={<DevSeed />} />
              )}
            </Routes>
          </Container>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App; 