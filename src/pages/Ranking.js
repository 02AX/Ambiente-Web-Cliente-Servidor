import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button, Badge } from 'react-bootstrap';
import DenunciaCard from '../components/DenunciaCard.js';
import denunciaController from '../controllers/DenunciaController.js';
import { formatearLikes } from '../utils/generalUtils.js';

const Ranking = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [criterioOrden, setCriterioOrden] = useState('likes');
  const [estadisticas, setEstadisticas] = useState({});

  useEffect(() => {
    cargarDatos();
  }, [criterioOrden]);

  const cargarDatos = async () => {
    try {
      const denunciasOrdenadas = await denunciaController.getDenunciasOrdenadas(criterioOrden);
      setDenuncias(denunciasOrdenadas);
      const stats = await denunciaController.getEstadisticas();
      setEstadisticas(stats);
    } catch (e) {
      setDenuncias([]);
      setEstadisticas({});
    }
  };

  const handleCriterioChange = (nuevoCriterio) => {
    setCriterioOrden(nuevoCriterio);
  };

  const handleUpdate = () => {
    cargarDatos();
  };

  const getTopDenuncias = (limit = 3) => {
    return denuncias.slice(0, limit);
  };

  const getIconForCriterio = (criterio) => {
    switch (criterio) {
      case 'likes':
        return 'bi-heart-fill';
      case 'fecha':
        return 'bi-clock';
      case 'comentarios':
        return 'bi-chat';
      default:
        return 'bi-list';
    }
  };

  return (
    <div className="fade-in">
      <Container>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold">
              <i className="bi bi-trophy me-3" style={{ color: '#f59e0b' }}></i>
              Ranking de Denuncias
            </h1>
            <p className="text-muted">
              Las denuncias más importantes según la votación de la comunidad
            </p>
          </div>
        </div>

        <Row>
          {/* Contenido Principal */}
          <Col lg={8}>
            {/* Controles de Ordenamiento */}
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <h5 className="mb-0">
                    <i className="bi bi-funnel me-2"></i>
                    Ordenar por:
                  </h5>
                  <ButtonGroup size="sm">
                    <Button
                      variant={criterioOrden === 'likes' ? 'primary' : 'outline-primary'}
                      onClick={() => handleCriterioChange('likes')}
                    >
                      <i className="bi bi-heart-fill me-1"></i>
                      Más Populares
                    </Button>
                    <Button
                      variant={criterioOrden === 'fecha' ? 'primary' : 'outline-primary'}
                      onClick={() => handleCriterioChange('fecha')}
                    >
                      <i className="bi bi-clock me-1"></i>
                      Más Recientes
                    </Button>
                    <Button
                      variant={criterioOrden === 'comentarios' ? 'primary' : 'outline-primary'}
                      onClick={() => handleCriterioChange('comentarios')}
                    >
                      <i className="bi bi-chat me-1"></i>
                      Más Comentadas
                    </Button>
                  </ButtonGroup>
                </div>
              </Card.Body>
            </Card>

            {/* Top 3 Destacadas */}
            {criterioOrden === 'likes' && (
              <section className="mb-5">
                <h3 className="h5 fw-bold mb-3">
                  <i className="bi bi-award me-2" style={{ color: '#f59e0b' }}></i>
                  Top 3 Más Populares
                </h3>
                <Row className="g-3">
                  {getTopDenuncias().map((denuncia, index) => (
                    <Col key={denuncia.id} md={6} lg={4}>
                      <div className="position-relative">
                        {/* Badge de posición */}
                        <Badge 
                          className="position-absolute top-0 start-0 translate-middle z-index-2"
                          bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'dark'}
                          style={{ fontSize: '0.875rem' }}
                        >
                          #{index + 1}
                        </Badge>
                        <DenunciaCard denuncia={denuncia} onUpdate={handleUpdate} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </section>
            )}

            {/* Lista Completa */}
            <section>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="h5 fw-bold">
                  <i className={`bi ${getIconForCriterio(criterioOrden)} me-2`}></i>
                  {criterioOrden === 'likes' && 'Ranking Completo'}
                  {criterioOrden === 'fecha' && 'Cronológico'}
                  {criterioOrden === 'comentarios' && 'Por Participación'}
                </h3>
                <span className="text-muted small">
                  {denuncias.length} denuncias en total
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                {denuncias.map((denuncia, index) => (
                  <Card key={denuncia.id} className="denuncia-card">
                    <Card.Body>
                      <Row className="align-items-center">
                        {/* Posición */}
                        <Col xs="auto">
                          <div 
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-muted"
                            style={{ width: '40px', height: '40px' }}
                          >
                            #{index + 1}
                          </div>
                        </Col>

                        {/* Contenido */}
                        <Col>
                          <div className="d-flex align-items-start justify-content-between mb-2">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1">
                                <Badge bg="secondary" className="me-2">
                                  {denuncia.categoria}
                                </Badge>
                                {denuncia.titulo}
                              </h6>
                              <p className="text-muted small mb-2">
                                {denuncia.descripcion.substring(0, 100)}...
                              </p>
                            </div>
                          </div>

                          <Row className="align-items-center text-muted small">
                            <Col sm="auto">
                              <i className="bi bi-heart-fill me-1" style={{ color: '#ef4444' }}></i>
                              <strong>{formatearLikes(denuncia.likes)}</strong> likes
                            </Col>
                            <Col sm="auto">
                              <i className="bi bi-chat me-1"></i>
                              {denuncia.comentarios.length} comentarios
                            </Col>
                            <Col sm="auto">
                              <i className="bi bi-clock me-1"></i>
                              {new Date(denuncia.fechaCreacion).toLocaleDateString()}
                            </Col>
                            <Col sm="auto" className="ms-auto">
                              <a 
                                href={`/denuncias/${denuncia.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Ver detalles
                              </a>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Estadísticas Generales */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Estadísticas Generales
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="text-center p-3 bg-light rounded">
                    <h3 className="fw-bold text-primary mb-1">
                      {estadisticas.totalDenuncias}
                    </h3>
                    <small className="text-muted">Total de Denuncias</small>
                  </div>
                  
                  <div className="text-center p-3 bg-light rounded">
                    <h3 className="fw-bold text-danger mb-1">
                      {formatearLikes(estadisticas.totalLikes)}
                    </h3>
                    <small className="text-muted">Likes Totales</small>
                  </div>
                  
                  <div className="text-center p-3 bg-light rounded">
                    <h3 className="fw-bold text-info mb-1">
                      {estadisticas.totalComentarios}
                    </h3>
                    <small className="text-muted">Comentarios Totales</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Categorías más Activas */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-pie-chart me-2"></i>
                  Categorías más Activas
                </h5>
                <div className="d-flex flex-column gap-2">
                  {Object.entries(estadisticas.categorias || {})
                    .sort(([,a], [,b]) => b - a)
                    .map(([categoria, cantidad]) => (
                      <div key={categoria} className="d-flex justify-content-between align-items-center">
                        <span className="small">{categoria}</span>
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="bg-primary rounded"
                            style={{
                              width: `${(cantidad / Math.max(...Object.values(estadisticas.categorias || {}))) * 50}px`,
                              height: '4px'
                            }}
                          ></div>
                          <span className="badge bg-secondary">{cantidad}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </Card.Body>
            </Card>

            {/* Información del Ranking */}
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-info-circle me-2"></i>
                  ¿Cómo funciona el ranking?
                </h5>
                <div className="small text-muted">
                  <p className="mb-2">
                    <strong>Por Popularidad:</strong> Las denuncias con más likes aparecen primero.
                  </p>
                  <p className="mb-2">
                    <strong>Por Fecha:</strong> Las denuncias más recientes aparecen primero.
                  </p>
                  <p className="mb-0">
                    <strong>Por Participación:</strong> Las denuncias con más comentarios aparecen primero.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Ranking; 