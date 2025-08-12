import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authController from '../controllers/AuthController.js';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (error) setError('');
  };

  const isValidEmail = (email) => {
        // Regex básico para validar email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (loading) return;

  const email = formData.email.trim();

  if (!isValidEmail(email)) {
    setError('Por favor ingresa un email válido.');
    return;
  }

  setLoading(true);
  console.log('Email enviado a login:', email);
  const result = await authController.login(email, formData.password);
  setLoading(false);

  if (result.success) {
    navigate('/denuncias/crear'); 
  } else {
    setError(result.message);
    }
  };

  return (
    <div className="fade-in">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-custom">
              <Card.Body className="p-5">
                <h2 className="fw-bold mb-4 text-center">Iniciar Sesión</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Contraseña"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <p>
                    ¿No tienes cuenta? <Link to="/register">Crear una</Link>
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

export default Login;
