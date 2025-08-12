import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DenunciaCard from '../components/DenunciaCard.js';
import denunciaController from '../controllers/DenunciaController.js';
import { noticiasDestacadas } from '../models/demoData.js';
import { formatearTiempoRelativo } from '../utils/dateUtils.js';

const Inicio = () => {
  const [denunciasRecientes, setDenunciasRecientes] = useState([]);
  const [denunciasPopulares, setDenunciasPopulares] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});

  useEffect(() => {
    // Cargar datos iniciales
  async function cargarDatos() {
    const recientes = await denunciaController.getDenunciasRecientes(3);
    const populares = await denunciaController.getDenunciasPopulares(3);
    const stats = await denunciaController.getEstadisticas();

    setDenunciasRecientes(recientes);
    setDenunciasPopulares(populares);
    setEstadisticas(stats);
  }
  cargarDatos();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 mb-5 rounded">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-shield-check me-3"></i>
                Sistema de Denuncias Anónimas
              </h1>
              <p className="lead mb-4">
                Plataforma ciudadana para reportar problemas comunitarios de forma anónima.
                La comunidad vota las denuncias más importantes para darles mayor visibilidad.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  as={Link} 
                  to="/denuncias/crear" 
                  variant="warning" 
                  size="lg"
                  className="fw-bold"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Denuncia
                </Button>
                <Button 
                  as={Link} 
                  to="/denuncias" 
                  variant="outline-light" 
                  size="lg"
                >
                  <i className="bi bi-eye me-2"></i>
                  Ver Denuncias
                </Button>
              </div>
            </Col>
            <Col lg={4} className="text-center">
              <div className="bg-white bg-opacity-10 rounded p-4">
                <h3 className="fw-bold">{estadisticas.totalDenuncias}</h3>
                <p className="mb-2">Denuncias Reportadas</p>
                <h4 className="fw-bold">{estadisticas.totalLikes}</h4>
                <p className="mb-0">Votos de la Comunidad</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        <Row>
          {/* Contenido Principal */}
          <Col lg={8}>
            {/* Noticias Destacadas */}
            <section className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold">
                  <i className="bi bi-newspaper me-2"></i>
                  Noticias Destacadas
                </h2>
              </div>
              
              <div className="row g-3">
                {noticiasDestacadas.map((noticia) => (
                  <div key={noticia.id} className="col-md-6">
                    <Alert variant="info" className="mb-0">
                      <div className="d-flex align-items-start">
                        <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                        <div>
                          <h6 className="alert-heading fw-bold mb-1">
                            {noticia.titulo}
                          </h6>
                          <p className="mb-1 small">
                            {noticia.descripcion}
                          </p>
                          <small className="text-muted">
                            {formatearTiempoRelativo(noticia.fecha)}
                          </small>
                        </div>
                      </div>
                    </Alert>
                  </div>
                ))}
              </div>
            </section>

            {/* Denuncias Recientes */}
            <section className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold">
                  <i className="bi bi-clock me-2"></i>
                  Denuncias Recientes
                </h2>
                <Link to="/denuncias" className="btn btn-outline-primary btn-sm">
                  Ver todas
                  <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
              
              <Row className="g-3">
                {denunciasRecientes.map((denuncia) => (
                  <Col md={6} lg={4} key={denuncia.id}>
                    <DenunciaCard denuncia={denuncia} />
                  </Col>
                ))}
              </Row>
            </section>

            {/* Denuncias Populares */}
            <section className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold">
                  <i className="bi bi-heart-fill me-2" style={{ color: '#ef4444' }}></i>
                  Más Populares
                </h2>
                <Link to="/ranking" className="btn btn-outline-primary btn-sm">
                  Ver ranking
                  <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
              
              <Row className="g-3">
                {denunciasPopulares.map((denuncia) => (
                  <Col md={6} lg={4} key={denuncia.id}>
                    <DenunciaCard denuncia={denuncia} />
                  </Col>
                ))}
              </Row>
            </section>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Cómo Funciona */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-question-circle me-2"></i>
                  ¿Cómo Funciona?
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', fontSize: '0.875rem' }}>
                      1
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Reporta</h6>
                      <small className="text-muted">
                        Crea una denuncia anónima sobre problemas en tu comunidad
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', fontSize: '0.875rem' }}>
                      2
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Vota</h6>
                      <small className="text-muted">
                        La comunidad vota las denuncias más importantes
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', fontSize: '0.875rem' }}>
                      3
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Se Resuelve</h6>
                      <small className="text-muted">
                        Las autoridades priorizan según la votación comunitaria
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Estadísticas por Categoría */}
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-bar-chart me-2"></i>
                  Categorías Populares
                </h5>
                <div className="d-flex flex-column gap-2">
                  {Object.entries(estadisticas.categorias || {})
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([categoria, cantidad]) => (
                      <div key={categoria} className="d-flex justify-content-between align-items-center">
                        <span className="small">{categoria}</span>
                        <span className="badge bg-secondary">{cantidad}</span>
                      </div>
                    ))
                  }
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inicio; 