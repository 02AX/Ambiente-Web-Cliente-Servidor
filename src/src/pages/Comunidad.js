import React from 'react';
import { Container, Row, Col, Card, Alert, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { reglasParticipacion } from '../models/demoData.js';
import denunciaController from '../controllers/DenunciaController.js';

const Comunidad = () => {
  const estadisticas = denunciaController.getEstadisticas();

  const consejosComunidad = [
    {
      titulo: "Sé específico en tus denuncias",
      descripcion: "Proporciona detalles claros sobre el problema, ubicación exacta y cómo afecta a la comunidad.",
      icon: "bi-bullseye",
      color: "primary"
    },
    {
      titulo: "Vota denuncias relevantes",
      descripcion: "Usa los likes para destacar problemas que realmente afectan a muchas personas.",
      icon: "bi-heart",
      color: "danger"
    },
    {
      titulo: "Comenta constructivamente",
      descripcion: "Aporta información útil, soluciones posibles o experiencias similares.",
      icon: "bi-chat-dots",
      color: "success"
    },
    {
      titulo: "Respeta la diversidad",
      descripcion: "Todos los problemas son válidos, independientemente del barrio o sector.",
      icon: "bi-people",
      color: "info"
    }
  ];

  const estadisticasComunidad = [
    {
      valor: estadisticas.totalDenuncias || 0,
      label: "Denuncias Activas",
      icon: "bi-exclamation-triangle",
      color: "primary"
    },
    {
      valor: estadisticas.totalLikes || 0,
      label: "Votos Comunitarios",
      icon: "bi-heart-fill",
      color: "danger"
    },
    {
      valor: estadisticas.totalComentarios || 0,
      label: "Comentarios",
      icon: "bi-chat",
      color: "success"
    },
    {
      valor: 3,
      label: "Usuarios Activos",
      icon: "bi-people",
      color: "info"
    }
  ];

  return (
    <div className="fade-in">
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
          </div>
          <h1 className="fw-bold">Comunidad</h1>
          <p className="text-muted lead">
            Construyamos juntos una plataforma transparente y efectiva para mejorar nuestra comunidad
          </p>
        </div>

        <Row>
          {/* Contenido Principal */}
          <Col lg={8}>
            {/* Principios de la Comunidad */}
            <section className="mb-5">
              <Card className="border-success">
                <Card.Header className="bg-success text-white">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    Nuestros Principios
                  </h3>
                </Card.Header>
                <Card.Body>
                  <p className="mb-3">
                    Esta plataforma está diseñada para ser <strong>100% autogestionada por la comunidad</strong>. 
                    No hay administradores centrales - el poder está en manos de todos los usuarios.
                  </p>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-shield-lock text-primary me-2 mt-1" style={{ fontSize: '1.25rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Anonimato Total</h6>
                          <small className="text-muted">
                            Tu identidad está completamente protegida
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-people text-success me-2 mt-1" style={{ fontSize: '1.25rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Poder Comunitario</h6>
                          <small className="text-muted">
                            Los usuarios deciden qué es importante
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-transparency text-info me-2 mt-1" style={{ fontSize: '1.25rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Transparencia</h6>
                          <small className="text-muted">
                            Todo es público y verificable
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-start">
                        <i className="bi bi-arrow-up-circle text-warning me-2 mt-1" style={{ fontSize: '1.25rem' }}></i>
                        <div>
                          <h6 className="fw-bold mb-1">Priorización Natural</h6>
                          <small className="text-muted">
                            Los likes determinan la importancia
                          </small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </section>

            {/* Reglas de Participación */}
            <section className="mb-5">
              <h2 className="h4 fw-bold mb-3">
                <i className="bi bi-clipboard-check me-2"></i>
                Reglas de Participación
              </h2>
              
              <div className="d-flex flex-column gap-3">
                {reglasParticipacion.map((regla, index) => (
                  <Card key={regla.id} className="border-0 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', fontSize: '0.875rem' }}>
                          {index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1">{regla.titulo}</h6>
                          <p className="text-muted mb-0 small">{regla.descripcion}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* Consejos para la Comunidad */}
            <section className="mb-5">
              <h2 className="h4 fw-bold mb-3">
                <i className="bi bi-lightbulb me-2"></i>
                Consejos para una Mejor Participación
              </h2>
              
              <Row className="g-3">
                {consejosComunidad.map((consejo, index) => (
                  <Col key={index} md={6}>
                    <Card className={`h-100 border-${consejo.color}`}>
                      <Card.Body>
                        <div className={`text-${consejo.color} mb-2`}>
                          <i className={`${consejo.icon}`} style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <h6 className="fw-bold">{consejo.titulo}</h6>
                        <p className="text-muted small mb-0">
                          {consejo.descripcion}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>

            {/* Cómo Reportar Problemas */}
            <section>
              <Card className="border-warning">
                <Card.Header className="bg-warning text-dark">
                  <h3 className="h5 mb-0">
                    <i className="bi bi-flag me-2"></i>
                    ¿Problema con el Contenido?
                  </h3>
                </Card.Header>
                <Card.Body>
                  <p className="mb-3">
                    Si encuentras contenido inapropiado, spam o que viola nuestras reglas:
                  </p>
                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-1-circle text-primary me-2"></i>
                      <span className="small">No respondas ni interactúes con el contenido problemático</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-2-circle text-primary me-2"></i>
                      <span className="small">Contacta al soporte a través de la sección correspondiente</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-3-circle text-primary me-2"></i>
                      <span className="small">Proporciona detalles específicos sobre el problema</span>
                    </div>
                  </div>
                  <Link to="/soporte" className="btn btn-warning">
                    <i className="bi bi-envelope me-2"></i>
                    Contactar Soporte
                  </Link>
                </Card.Body>
              </Card>
            </section>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Estadísticas de la Comunidad */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Estadísticas de la Comunidad
                </h5>
                <div className="d-flex flex-column gap-3">
                  {estadisticasComunidad.map((stat, index) => (
                    <div key={index} className="text-center p-3 bg-light rounded">
                      <div className={`text-${stat.color} mb-2`}>
                        <i className={stat.icon} style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h4 className={`fw-bold text-${stat.color} mb-1`}>
                        {stat.valor}
                      </h4>
                      <small className="text-muted">{stat.label}</small>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Participación Destacada */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-star me-2"></i>
                  Participación Destacada
                </h5>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="small">Usuario más activo</span>
                    <Badge bg="primary">admin</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="small">Denuncia más popular</span>
                    <Badge bg="danger">47 likes</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="small">Categoría más activa</span>
                    <Badge bg="success">Infraestructura</Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-lightning me-2"></i>
                  Acciones Rápidas
                </h5>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/denuncias/crear" variant="primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Crear Denuncia
                  </Button>
                  <Button as={Link} to="/denuncias" variant="outline-primary">
                    <i className="bi bi-eye me-2"></i>
                    Ver Denuncias
                  </Button>
                  <Button as={Link} to="/ranking" variant="outline-secondary">
                    <i className="bi bi-trophy me-2"></i>
                    Ver Ranking
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Comunidad; 