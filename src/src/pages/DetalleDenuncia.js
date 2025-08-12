import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import DenunciaCard from '../components/DenunciaCard.js';
import ComentarioItem from '../components/ComentarioItem.js';
import denunciaController from '../controllers/DenunciaController.js';
import authController from '../controllers/AuthController.js';
import { formatearTiempoRelativo } from '../utils/dateUtils.js';
import { validarLongitud } from '../utils/generalUtils.js';

const DetalleDenuncia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [denuncia, setDenuncia] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [error, setError] = useState('');
  const [errorComentario, setErrorComentario] = useState('');
  const [mostrarFormComentario, setMostrarFormComentario] = useState(false);

  useEffect(() => {
    cargarDenunciaYComentarios();
  }, [id]);

  const cargarDenunciaYComentarios = () => {
    setLoading(true);
    
    // Simular carga desde API
    setTimeout(() => {
      const denunciaEncontrada = denunciaController.getDenunciaById(id);
      
      if (denunciaEncontrada) {
        setDenuncia(denunciaEncontrada);
        const comentariosDenuncia = denunciaController.getComentariosByDenuncia(id);
        setComentarios(comentariosDenuncia);
        setError('');
      } else {
        setError('Denuncia no encontrada');
      }
      
      setLoading(false);
    }, 500);
  };

  const handleComentarioChange = (e) => {
    setNuevoComentario(e.target.value);
    if (errorComentario) setErrorComentario('');
  };

  const handleSubmitComentario = (e) => {
    e.preventDefault();
    
    if (!authController.isUserAuthenticated()) {
      alert('Debe iniciar sesión para comentar');
      navigate('/login');
      return;
    }

    if (!validarLongitud(nuevoComentario, 1, 500)) {
      setErrorComentario('El comentario debe tener entre 1 y 500 caracteres');
      return;
    }

    setEnviandoComentario(true);

    setTimeout(() => {
      const result = denunciaController.agregarComentario(id, nuevoComentario);
      
      if (result.success) {
        setNuevoComentario('');
        setMostrarFormComentario(false);
        cargarDenunciaYComentarios(); // Recargar para mostrar el nuevo comentario
      } else {
        setErrorComentario(result.message);
      }
      
      setEnviandoComentario(false);
    }, 1000);
  };

  const handleUpdate = () => {
    cargarDenunciaYComentarios();
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center">
                <Card.Body className="py-5">
                  <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
                  <h3 className="fw-bold mt-3 mb-3">Denuncia no encontrada</h3>
                  <p className="text-muted mb-4">
                    La denuncia que estás buscando no existe o ha sido eliminada.
                  </p>
                  <Button variant="primary" onClick={() => navigate('/denuncias')}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Ver todas las denuncias
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Container>
        <Row>
          {/* Contenido Principal */}
          <Col lg={8}>
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => navigate('/denuncias')}
                  >
                    Denuncias
                  </button>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {denuncia.titulo.substring(0, 50)}...
                </li>
              </ol>
            </nav>

            {/* Denuncia Principal */}
            <Card className="denuncia-card mb-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <Badge bg="primary" className="categoria-badge">
                    {denuncia.categoria}
                  </Badge>
                  <div className="likes-section">
                    <button
                      className={`like-button ${denunciaController.hasUserLikedDenuncia(denuncia.id) ? 'liked' : ''}`}
                      onClick={() => {
                        const result = denunciaController.toggleLikeDenuncia(denuncia.id);
                        if (result.success) {
                          handleUpdate();
                        }
                      }}
                      disabled={!authController.isUserAuthenticated()}
                    >
                      <i className={`bi ${denunciaController.hasUserLikedDenuncia(denuncia.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                    </button>
                    <span className="likes-count ms-2">{denuncia.likes}</span>
                  </div>
                </div>

                <h1 className="fw-bold mb-3">{denuncia.titulo}</h1>
                
                <div className="mb-4">
                  <p className="mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {denuncia.descripcion}
                  </p>
                </div>

                <div className="d-flex align-items-center text-muted small border-top pt-3">
                  <div className="me-4">
                    <i className="bi bi-clock me-1"></i>
                    Publicado {formatearTiempoRelativo(denuncia.fechaCreacion)}
                  </div>
                  <div className="me-4">
                    <i className="bi bi-chat me-1"></i>
                    {comentarios.length} comentario{comentarios.length !== 1 ? 's' : ''}
                  </div>
                  <div>
                    <i className="bi bi-eye me-1"></i>
                    Vista detallada
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Sección de Comentarios */}
            <Card>
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">
                    <i className="bi bi-chat-dots me-2"></i>
                    Comentarios ({comentarios.length})
                  </h4>
                  {authController.isUserAuthenticated() && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setMostrarFormComentario(!mostrarFormComentario)}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Agregar comentario
                    </Button>
                  )}
                </div>
              </Card.Header>
              
              <Card.Body className="p-0">
                {/* Formulario para nuevo comentario */}
                {mostrarFormComentario && (
                  <div className="p-4 border-bottom bg-light">
                    <Form onSubmit={handleSubmitComentario}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Agregar tu comentario
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={nuevoComentario}
                          onChange={handleComentarioChange}
                          placeholder="Comparte tu opinión, experiencia o información adicional sobre este problema..."
                          isInvalid={!!errorComentario}
                          disabled={enviandoComentario}
                          maxLength={500}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errorComentario}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          {nuevoComentario.length}/500 caracteres
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-flex gap-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          disabled={enviandoComentario || !nuevoComentario.trim()}
                        >
                          {enviandoComentario ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-1"></i>
                              Publicar comentario
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setMostrarFormComentario(false);
                            setNuevoComentario('');
                            setErrorComentario('');
                          }}
                          disabled={enviandoComentario}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}

                {/* Lista de comentarios */}
                <div className="p-4">
                  {comentarios.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {comentarios.map(comentario => (
                        <ComentarioItem key={comentario.id} comentario={comentario} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-chat text-muted" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3 text-muted">No hay comentarios aún</h5>
                      <p className="text-muted">
                        Sé el primero en comentar sobre esta denuncia
                      </p>
                      {!authController.isUserAuthenticated() && (
                        <Button
                          variant="outline-primary"
                          onClick={() => navigate('/login')}
                        >
                          Iniciar sesión para comentar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Información de la Denuncia */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Información
                </h5>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Categoría:</span>
                    <Badge bg="secondary">{denuncia.categoria}</Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Estado:</span>
                    <Badge bg="success">Activa</Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Fecha:</span>
                    <span className="small">{new Date(denuncia.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Likes:</span>
                    <span className="small fw-bold">{denuncia.likes}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">Comentarios:</span>
                    <span className="small fw-bold">{comentarios.length}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Acciones */}
            <Card className="sidebar mb-4">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-lightning me-2"></i>
                  Acciones
                </h5>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate('/denuncias')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Ver todas las denuncias
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => navigate('/denuncias/crear')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Crear nueva denuncia
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => navigate('/ranking')}
                  >
                    <i className="bi bi-trophy me-2"></i>
                    Ver ranking
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Compartir */}
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-share me-2"></i>
                  Compartir
                </h5>
                <p className="small text-muted mb-3">
                  Ayuda a dar visibilidad a este problema compartiéndolo con otros
                </p>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Enlace copiado al portapapeles');
                    }}
                  >
                    <i className="bi bi-clipboard me-2"></i>
                    Copiar enlace
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

export default DetalleDenuncia; 