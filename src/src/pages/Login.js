import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authController from '../controllers/AuthController.js';
import { USUARIO_DEMO } from '../models/demoData.js';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    try {
      const result = await authController.login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/denuncias/crear');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Hubo un error al iniciar sesión');
    }

    setLoading(false);
  };

  const handleDemoLogin = () => {
    setFormData({
      username: USUARIO_DEMO.username,
      password: USUARIO_DEMO.password
    });
  };

  return (
    <div className="fade-in">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-custom">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-shield-lock" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <h2 className="fw-bold">Iniciar Sesión</h2>
                  <p className="text-muted">
                    Accede al sistema de denuncias anónimas
                  </p>
                </div>

                {/* Credenciales Demo */}
                <Alert variant="info" className="mb-4">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                    <div>
                      <h6 className="alert-heading fw-bold mb-2">Cuenta Demo</h6>
                      <p className="mb-2 small">
                        <strong>Usuario:</strong> {USUARIO_DEMO.username}<br />
                        <strong>Contraseña:</strong> {USUARIO_DEMO.password}
                      </p>
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={handleDemoLogin}
                      >
                        <i className="bi bi-lightning me-1"></i>
                        Usar credenciales demo
                      </Button>
                    </div>
                  </div>
                </Alert>

                <Form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="danger" className="mb-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person me-2"></i>
                      Usuario
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Ingresa tu usuario"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <i className="bi bi-lock me-2"></i>
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted small mb-2">
                    ¿No tienes cuenta?
                  </p>
                  <Alert variant="warning" className="small mb-0">
                    <i className="bi bi-construction me-2"></i>
                    El registro estará disponible cuando se implemente Firebase Authentication
                  </Alert>
                </div>
              </Card.Body>
            </Card>

            {/* Información adicional */}
            <Card className="mt-4 border-0 bg-transparent">
              <Card.Body className="text-center">
                <h6 className="fw-bold mb-3">¿Por qué necesitas una cuenta?</h6>
                <Row className="g-3">
                  <Col sm={4}>
                    <div className="text-primary mb-2">
                      <i className="bi bi-plus-circle" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <small className="text-muted">
                      Crear denuncias anónimas
                    </small>
                  </Col>
                  <Col sm={4}>
                    <div className="text-primary mb-2">
                      <i className="bi bi-heart" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <small className="text-muted">
                      Votar denuncias importantes
                    </small>
                  </Col>
                  <Col sm={4}>
                    <div className="text-primary mb-2">
                      <i className="bi bi-chat" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <small className="text-muted">
                      Participar en comentarios
                    </small>
                  </Col>
                </Row>
                
                <div className="mt-4">
                  <Link to="/" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al inicio
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 