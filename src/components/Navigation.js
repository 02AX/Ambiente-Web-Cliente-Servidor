import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authController from '../controllers/AuthController.js';

const Navigation = ({ isAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    authController.logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      className="navbar-custom"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid="xl">
        <Navbar.Brand as={Link} to="/" onClick={handleNavClick}>
          <i className="bi bi-shield-check me-2"></i>
          Sistema Denuncias
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleNavClick}>
              <i className="bi bi-house-door me-1"></i>
              Inicio
            </Nav.Link>
            
            <Nav.Link as={Link} to="/denuncias" onClick={handleNavClick}>
              <i className="bi bi-exclamation-triangle me-1"></i>
              Denuncias
            </Nav.Link>
            
            <Nav.Link as={Link} to="/ranking" onClick={handleNavClick}>
              <i className="bi bi-trophy me-1"></i>
              Ranking
            </Nav.Link>
            
            <Nav.Link as={Link} to="/comunidad" onClick={handleNavClick}>
              <i className="bi bi-people me-1"></i>
              Comunidad
            </Nav.Link>
            
            <Nav.Link as={Link} to="/soporte" onClick={handleNavClick}>
              <i className="bi bi-question-circle me-1"></i>
              Soporte
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/denuncias/crear" onClick={handleNavClick}>
                  <Button variant="outline-light" size="sm">
                    <i className="bi bi-plus-circle me-1"></i>
                    Nueva Denuncia
                  </Button>
                </Nav.Link>
                
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {currentUser?.displayName || currentUser?.email || 'Usuario'}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/perfil" onClick={handleNavClick}>
                    <i className="bi bi-person me-2"></i>
                    Mi Perfil
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={handleNavClick}>
                  <Button variant="outline-light" size="sm" className="me-2">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleNavClick}>
                  <Button variant="warning" size="sm">
                    <i className="bi bi-person-plus me-1"></i>
                    Crear Cuenta
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 