import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-custom border-top mt-5 py-4">
      <Container fluid="xl">
        <Row>
          <Col md={6}>
            <h6 className="fw-bold text-primary-blue">
              <i className="bi bi-shield-check me-2"></i>
              Sistema de Denuncias Anónimas
            </h6>
            <p className="text-muted-custom mb-2">
              Plataforma ciudadana para reportar problemas comunitarios de forma anónima
              y colaborativa.
            </p>
            <p className="text-muted-custom small mb-0">
              © {currentYear} Sistema de Denuncias. Todos los derechos reservados.
            </p>
          </Col>
          
          <Col md={3}>
            <h6 className="fw-bold">Enlaces Útiles</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/denuncias" className="text-decoration-none text-muted-custom">
                  Ver Denuncias
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="text-decoration-none text-muted-custom">
                  Ranking Popular
                </Link>
              </li>
              <li>
                <Link to="/comunidad" className="text-decoration-none text-muted-custom">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link to="/soporte" className="text-decoration-none text-muted-custom">
                  Soporte
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h6 className="fw-bold">Información</h6>
            <ul className="list-unstyled">
              <li className="text-muted-custom">
                <i className="bi bi-envelope me-2"></i>
                contacto@denuncias.com
              </li>
              <li className="text-muted-custom">
                <i className="bi bi-shield-lock me-2"></i>
                100% Anónimo
              </li>
              <li className="text-muted-custom">
                <i className="bi bi-people me-2"></i>
                Gestión Comunitaria
              </li>
              <li className="text-muted-custom">
                <i className="bi bi-clock me-2"></i>
                24/7 Disponible
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="border-custom" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted-custom small mb-0">
              Desarrollado con React.js y Bootstrap
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="text-muted-custom small mb-0">
              Versión 1.0.0 - Demo
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 