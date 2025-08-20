import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DenunciaCard from '../components/DenunciaCard.js';
import authController from '../controllers/AuthController.js';
import denunciaController from '../controllers/DenunciaController.js';
import { obtenerIniciales, generarColorPorTexto } from '../utils/generalUtils.js';
import { formatearFecha } from '../utils/dateUtils.js';

const PerfilUsuario = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({});
  const [misDenuncias, setMisDenuncias] = useState([]);
  const [denunciasLikadas, setDenunciasLikadas] = useState([]);
  const [configuraciones, setConfiguraciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [guardandoConfig, setGuardandoConfig] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    setLoading(true);
    const user = authController.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setUserStats({ denunciasCreadas: 0, denunciasLikadas: 0, comentarios: 0, fechaRegistro: '' });
      setConfiguraciones({ notificaciones: true, mostrarPerfil: false, modoAnonimo: true });
      const denunciasUsuario = await denunciaController.getMisDenuncias();
      setMisDenuncias(denunciasUsuario);
      const denunciasConLikes = await denunciaController.getDenunciasConMisLikes();
      setDenunciasLikadas(denunciasConLikes);
    }
    setLoading(false);
  };

  const handleConfigChange = (key, value) => {
    setConfiguraciones(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGuardarConfiguraciones = () => {
    setGuardandoConfig(true);
    setTimeout(() => {
      setMensajeExito('Configuraciones guardadas (local)');
      setTimeout(() => setMensajeExito(''), 3000);
      setGuardandoConfig(false);
    }, 800);
  };

  const handleUpdate = () => {
    cargarDatosUsuario();
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="fade-in">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center">
                <Card.Body className="py-5">
                  <i className="bi bi-person-x text-warning" style={{ fontSize: '4rem' }}></i>
                  <h3 className="fw-bold mt-3 mb-3">Error de autenticación</h3>
                  <p className="text-muted mb-4">
                    No se pudo cargar la información del usuario.
                  </p>
                  <Link to="/login" className="btn btn-primary">
                    Iniciar sesión
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const displayName = currentUser.displayName || currentUser.email || 'Usuario';
  const iniciales = obtenerIniciales(displayName);
  const colorAvatar = generarColorPorTexto(displayName);

  return (
    <div className="fade-in">
      <Container>
        {/* Header del Perfil */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: colorAvatar,
                        fontSize: '2rem'
                      }}
                    >
                      {iniciales}
                    </div>
                  </Col>
                  <Col>
                    <h2 className="fw-bold mb-1">{displayName}</h2>
                    <p className="text-muted mb-2">
                      Miembro desde {formatearFecha(currentUser.fechaRegistro)}
                    </p>
                    <div className="d-flex gap-3">
                      <Badge bg="primary">
                        {userStats.denunciasCreadas} Denuncias
                      </Badge>
                      <Badge bg="danger">
                        {userStats.denunciasLikadas} Likes dados
                      </Badge>
                      <Badge bg="success">
                        {userStats.comentarios} Comentarios
                      </Badge>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="text-center">
                      <h3 className="fw-bold text-primary mb-1">
                        {misDenuncias.reduce((total, d) => total + d.likes, 0)}
                      </h3>
                      <small className="text-muted">Likes recibidos</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs de Contenido */}
        <Row>
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(tab) => setActiveTab(tab)}
              className="mb-4"
              fill
            >
              {/* Tab Resumen */}
              <Tab eventKey="resumen" title={
                <span>
                  <i className="bi bi-house me-1"></i>
                  Resumen
                </span>
              }>
                <Row>
                  {/* Estadísticas */}
                  <Col lg={8}>
                    <Row className="g-3 mb-4">
                      <Col md={3}>
                        <Card className="text-center h-100">
                          <Card.Body>
                            <i className="bi bi-exclamation-triangle text-primary" style={{ fontSize: '2rem' }}></i>
                            <h4 className="fw-bold mt-2 mb-1">{userStats.denunciasCreadas}</h4>
                            <small className="text-muted">Denuncias Creadas</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center h-100">
                          <Card.Body>
                            <i className="bi bi-heart-fill text-danger" style={{ fontSize: '2rem' }}></i>
                            <h4 className="fw-bold mt-2 mb-1">{misDenuncias.reduce((total, d) => total + d.likes, 0)}</h4>
                            <small className="text-muted">Likes Recibidos</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center h-100">
                          <Card.Body>
                            <i className="bi bi-chat text-success" style={{ fontSize: '2rem' }}></i>
                            <h4 className="fw-bold mt-2 mb-1">{userStats.comentarios}</h4>
                            <small className="text-muted">Comentarios</small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center h-100">
                          <Card.Body>
                            <i className="bi bi-hand-thumbs-up text-info" style={{ fontSize: '2rem' }}></i>
                            <h4 className="fw-bold mt-2 mb-1">{userStats.denunciasLikadas}</h4>
                            <small className="text-muted">Likes Dados</small>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Actividad Reciente */}
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-clock-history me-2"></i>
                          Actividad Reciente
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex flex-column gap-3">
                          {misDenuncias.length === 0 ? (
                            <div className="text-center py-4">
                              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                              <h6 className="mt-3 text-muted">No hay actividad reciente</h6>
                              <p className="text-muted small">
                                Crea tu primera denuncia para comenzar
                              </p>
                              <Link to="/denuncias/crear" className="btn btn-outline-primary btn-sm">
                                Crear Denuncia
                              </Link>
                            </div>
                          ) : (
                            misDenuncias.slice(0, 3).map(denuncia => (
                              <div key={denuncia.id} className="d-flex align-items-center p-3 bg-light rounded">
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">
                                    <Link to={`/denuncias/${denuncia.id}`} className="text-decoration-none">
                                      {denuncia.titulo}
                                    </Link>
                                  </h6>
                                  <small className="text-muted">
                                    {formatearFecha(denuncia.fechaCreacion)} • {denuncia.likes} likes
                                  </small>
                                </div>
                                <Badge bg="secondary">{denuncia.categoria}</Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Sidebar */}
                  <Col lg={4}>
                    <Card className="sidebar mb-4">
                      <Card.Body>
                        <h5 className="sidebar-title">
                          <i className="bi bi-info-circle me-2"></i>
                          Información del Perfil
                        </h5>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">Usuario:</span>
                            <span className="small">{displayName}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">Email:</span>
                            <span className="small">{currentUser.email}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">Registro:</span>
                            <span className="small">{userStats.fechaRegistro}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">Modo:</span>
                            <Badge bg={configuraciones.modoAnonimo ? 'success' : 'warning'}>
                              {configuraciones.modoAnonimo ? 'Anónimo' : 'Público'}
                            </Badge>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    <Card className="sidebar">
                      <Card.Body>
                        <h5 className="sidebar-title">
                          <i className="bi bi-lightning me-2"></i>
                          Acciones Rápidas
                        </h5>
                        <div className="d-grid gap-2">
                          <Button as={Link} to="/denuncias/crear" variant="primary" size="sm">
                            <i className="bi bi-plus-circle me-2"></i>
                            Crear Denuncia
                          </Button>
                          <Button as={Link} to="/denuncias" variant="outline-primary" size="sm">
                            <i className="bi bi-eye me-2"></i>
                            Ver Denuncias
                          </Button>
                          <Button as={Link} to="/ranking" variant="outline-secondary" size="sm">
                            <i className="bi bi-trophy me-2"></i>
                            Ver Ranking
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              {/* Tab Mis Denuncias */}
              <Tab eventKey="denuncias" title={
                <span>
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Mis Denuncias ({misDenuncias.length})
                </span>
              }>
                {misDenuncias.length > 0 ? (
                  <Row className="g-3">
                    {misDenuncias.map(denuncia => (
                      <Col key={denuncia.id} md={6} lg={4}>
                        <DenunciaCard denuncia={denuncia} onUpdate={handleUpdate} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Card className="text-center">
                    <Card.Body className="py-5">
                      <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
                      <h4 className="mt-3 mb-3">No has creado denuncias</h4>
                      <p className="text-muted mb-4">
                        Comparte los problemas de tu comunidad creando tu primera denuncia
                      </p>
                      <Link to="/denuncias/crear" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Crear Primera Denuncia
                      </Link>
                    </Card.Body>
                  </Card>
                )}
              </Tab>

              {/* Tab Denuncias con Like */}
              <Tab eventKey="likes" title={
                <span>
                  <i className="bi bi-heart me-1"></i>
                  Mis Likes ({denunciasLikadas.length})
                </span>
              }>
                {denunciasLikadas.length > 0 ? (
                  <Row className="g-3">
                    {denunciasLikadas.map(denuncia => (
                      <Col key={denuncia.id} md={6} lg={4}>
                        <DenunciaCard denuncia={denuncia} onUpdate={handleUpdate} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Card className="text-center">
                    <Card.Body className="py-5">
                      <i className="bi bi-heart text-muted" style={{ fontSize: '4rem' }}></i>
                      <h4 className="mt-3 mb-3">No has dado likes</h4>
                      <p className="text-muted mb-4">
                        Vota por las denuncias que consideres importantes para darles mayor visibilidad
                      </p>
                      <Link to="/denuncias" className="btn btn-outline-primary">
                        <i className="bi bi-eye me-2"></i>
                        Explorar Denuncias
                      </Link>
                    </Card.Body>
                  </Card>
                )}
              </Tab>

              {/* Tab Configuración */}
              <Tab eventKey="configuracion" title={
                <span>
                  <i className="bi bi-gear me-1"></i>
                  Configuración
                </span>
              }>
                <Row className="justify-content-center">
                  <Col lg={8}>
                    <Card>
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-gear me-2"></i>
                          Configuraciones de la Cuenta
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-4">
                        {mensajeExito && (
                          <Alert variant="success" className="mb-4">
                            <i className="bi bi-check-circle me-2"></i>
                            {mensajeExito}
                          </Alert>
                        )}

                        <Form>
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Privacidad</h6>
                            
                            <Form.Check
                              type="switch"
                              id="modo-anonimo"
                              label="Modo anónimo"
                              checked={configuraciones.modoAnonimo}
                              onChange={(e) => handleConfigChange('modoAnonimo', e.target.checked)}
                              className="mb-2"
                            />
                            <Form.Text className="text-muted">
                              Cuando está activado, tu nombre no se muestra públicamente en denuncias y comentarios
                            </Form.Text>
                          </div>

                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Notificaciones</h6>
                            
                            <Form.Check
                              type="switch"
                              id="notificaciones"
                              label="Recibir notificaciones"
                              checked={configuraciones.notificaciones}
                              onChange={(e) => handleConfigChange('notificaciones', e.target.checked)}
                              className="mb-2"
                            />
                            <Form.Text className="text-muted">
                              Recibe notificaciones sobre respuestas a tus denuncias y comentarios
                            </Form.Text>
                          </div>

                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Perfil</h6>
                            
                            <Form.Check
                              type="switch"
                              id="mostrar-perfil"
                              label="Mostrar perfil público"
                              checked={configuraciones.mostrarPerfil}
                              onChange={(e) => handleConfigChange('mostrarPerfil', e.target.checked)}
                              className="mb-2"
                            />
                            <Form.Text className="text-muted">
                              Permite que otros usuarios vean tu perfil y estadísticas públicas
                            </Form.Text>
                          </div>

                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              onClick={handleGuardarConfiguraciones}
                              disabled={guardandoConfig}
                            >
                              {guardandoConfig ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Guardando...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check me-2"></i>
                                  Guardar Cambios
                                </>
                              )}
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PerfilUsuario; 