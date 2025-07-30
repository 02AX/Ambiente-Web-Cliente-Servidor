import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { preguntasFrecuentes } from '../models/demoData.js';

const Soporte = () => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const faqsFiltradas = preguntasFrecuentes.filter(faq =>
    faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
    faq.respuesta.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className="fade-in">
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-question-circle" style={{ fontSize: '2rem' }}></i>
          </div>
          <h1 className="fw-bold">Centro de Soporte</h1>
          <p className="text-muted lead">
            Encuentra respuestas a tus preguntas sobre el sistema de denuncias
          </p>
        </div>

        <Row>
          {/* Contenido Principal */}
          <Col lg={8}>
            {/* Buscador */}
            <Card className="mb-4">
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      <i className="bi bi-search me-2"></i>
                      Buscar en preguntas frecuentes
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Escribe tu pregunta aquí..."
                      value={busqueda}
                      onChange={handleBusquedaChange}
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Preguntas Frecuentes */}
            <section className="mb-5">
              <h2 className="h4 fw-bold mb-3">
                <i className="bi bi-question-circle-fill me-2"></i>
                Preguntas Frecuentes
              </h2>
              
              {faqsFiltradas.length > 0 ? (
                <Accordion>
                  {faqsFiltradas.map((faq, index) => (
                    <Accordion.Item key={faq.id} eventKey={index.toString()}>
                      <Accordion.Header>
                        <strong>{faq.pregunta}</strong>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p className="mb-0">{faq.respuesta}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  No se encontraron preguntas que coincidan con tu búsqueda.
                </Alert>
              )}
            </section>

            {/* Guías Rápidas */}
            <section className="mb-5">
              <h2 className="h4 fw-bold mb-3">
                <i className="bi bi-book me-2"></i>
                Guías Rápidas
              </h2>
              
              <Row className="g-3">
                <Col md={6}>
                  <Card className="h-100 border-primary">
                    <Card.Body>
                      <div className="text-primary mb-2">
                        <i className="bi bi-plus-circle" style={{ fontSize: '2rem' }}></i>
                      </div>
                      <h5 className="fw-bold">Crear una Denuncia</h5>
                      <p className="text-muted small mb-3">
                        Aprende a reportar problemas de forma efectiva
                      </p>
                      <ol className="small">
                        <li>Inicia sesión en tu cuenta</li>
                        <li>Haz clic en "Nueva Denuncia"</li>
                        <li>Completa el formulario con detalles</li>
                        <li>Selecciona la categoría apropiada</li>
                        <li>Publica tu denuncia</li>
                      </ol>
                      <Link to="/denuncias/crear" className="btn btn-outline-primary btn-sm">
                        Crear Denuncia
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="h-100 border-success">
                    <Card.Body>
                      <div className="text-success mb-2">
                        <i className="bi bi-heart" style={{ fontSize: '2rem' }}></i>
                      </div>
                      <h5 className="fw-bold">Votar Denuncias</h5>
                      <p className="text-muted small mb-3">
                        Ayuda a priorizar las denuncias importantes
                      </p>
                      <ol className="small">
                        <li>Navega por las denuncias</li>
                        <li>Lee los detalles completos</li>
                        <li>Haz clic en el corazón para votar</li>
                        <li>Comenta para aportar información</li>
                        <li>Comparte denuncias importantes</li>
                      </ol>
                      <Link to="/denuncias" className="btn btn-outline-success btn-sm">
                        Ver Denuncias
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </section>

            {/* Contacto */}
            <section>
              <Card className="border-warning">
                <Card.Body>
                  <h3 className="h5 fw-bold mb-3">
                    <i className="bi bi-envelope me-2"></i>
                    ¿No encontraste lo que buscabas?
                  </h3>
                  <p className="text-muted mb-3">
                    Si tu pregunta no está en las FAQ, puedes contactarnos directamente.
                  </p>
                  
                  {!mostrarContacto ? (
                    <Button 
                      variant="warning" 
                      onClick={() => setMostrarContacto(true)}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Contactar Soporte
                    </Button>
                  ) : (
                    <Alert variant="warning">
                      <h6 className="alert-heading fw-bold">Información de Contacto</h6>
                      <p className="mb-2">
                        <strong>Email:</strong> soporte@denuncias.com
                      </p>
                      <p className="mb-2">
                        <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
                      </p>
                      <p className="mb-0">
                        <strong>Tiempo de respuesta:</strong> 24-48 horas
                      </p>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </section>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Enlaces Rápidos */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-link-45deg me-2"></i>
                  Enlaces Rápidos
                </h5>
                <div className="d-flex flex-column gap-2">
                  <Link to="/denuncias" className="text-decoration-none">
                    <div className="d-flex align-items-center p-2 rounded bg-light">
                      <i className="bi bi-exclamation-triangle me-2 text-primary"></i>
                      <span>Ver todas las denuncias</span>
                    </div>
                  </Link>
                  
                  <Link to="/ranking" className="text-decoration-none">
                    <div className="d-flex align-items-center p-2 rounded bg-light">
                      <i className="bi bi-trophy me-2 text-warning"></i>
                      <span>Ranking de popularidad</span>
                    </div>
                  </Link>
                  
                  <Link to="/comunidad" className="text-decoration-none">
                    <div className="d-flex align-items-center p-2 rounded bg-light">
                      <i className="bi bi-people me-2 text-success"></i>
                      <span>Reglas de la comunidad</span>
                    </div>
                  </Link>
                  
                  <Link to="/login" className="text-decoration-none">
                    <div className="d-flex align-items-center p-2 rounded bg-light">
                      <i className="bi bi-box-arrow-in-right me-2 text-info"></i>
                      <span>Iniciar sesión</span>
                    </div>
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Estadísticas de Soporte */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-graph-up me-2"></i>
                  Estadísticas de Ayuda
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="text-center p-2 bg-light rounded">
                    <h4 className="fw-bold text-primary mb-1">
                      {preguntasFrecuentes.length}
                    </h4>
                    <small className="text-muted">Preguntas Frecuentes</small>
                  </div>
                  
                  <div className="text-center p-2 bg-light rounded">
                    <h4 className="fw-bold text-success mb-1">98%</h4>
                    <small className="text-muted">Problemas Resueltos</small>
                  </div>
                  
                  <div className="text-center p-2 bg-light rounded">
                    <h4 className="fw-bold text-info mb-1">24h</h4>
                    <small className="text-muted">Tiempo de Respuesta</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Recursos Adicionales */}
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-file-text me-2"></i>
                  Recursos Adicionales
                </h5>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check me-2 text-success"></i>
                    <span>Política de Privacidad</span>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    <span>Términos de Uso</span>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <i className="bi bi-github me-2 text-dark"></i>
                    <span>Código Fuente</span>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <i className="bi bi-chat-dots me-2 text-info"></i>
                    <span>Foro de la Comunidad</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Soporte; 