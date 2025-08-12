import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authController from '../controllers/AuthController.js';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!formData.email || !formData.username || !formData.password) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    const result = await authController.register(formData.email, formData.password, formData.username);
    setLoading(false);

    if (result.success) {
      navigate('/login'); 
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
                <h2 className="fw-bold mb-4 text-center">Crear Cuenta</h2>
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

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de Usuario</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      placeholder="Tu nombre de usuario" 
                      required 
                      disabled={loading} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder="Repite la contraseña" 
                      required 
                      disabled={loading} 
                    />
                  </Form.Group>

                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  <p>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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

export default Register;
