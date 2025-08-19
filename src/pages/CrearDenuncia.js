import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import denunciaController from '../controllers/DenunciaController.js';
import authController from '../controllers/AuthController.js';
import { CATEGORIAS } from '../models/Denuncia.js';
import { validarLongitud } from '../utils/generalUtils.js';

const CrearDenuncia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validarLongitud(formData.titulo, 5, 100)) {
      newErrors.titulo = 'El título debe tener entre 5 y 100 caracteres';
    }

    if (!validarLongitud(formData.descripcion, 10, 1000)) {
      newErrors.descripcion = 'La descripción debe tener entre 10 y 1000 caracteres';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Debe seleccionar una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await denunciaController.crearDenuncia(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => { navigate(`/denuncias/${result.denuncia.id}`); }, 1200);
    } else {
      if (result.errores) {
        const formErrors = {};
        result.errores.forEach(error => {
          if (error.includes('título')) formErrors.titulo = error;
          if (error.includes('descripción')) formErrors.descripcion = error;
          if (error.includes('categoría')) formErrors.categoria = error;
        });
        setErrors(formErrors);
      } else {
        setErrors({ general: result.message });
      }
      setLoading(false);
    }
  };

  const getCategoriaInfo = (categoria) => {
    const info = {
      'Seguridad': {
        description: 'Problemas de seguridad pública, delincuencia, iluminación deficiente',
        color: 'danger'
      },
      'Infraestructura': {
        description: 'Calles, puentes, aceras, semáforos, señalización vial',
        color: 'warning'
      },
      'Medio Ambiente': {
        description: 'Contaminación, ruido, basura, espacios verdes',
        color: 'success'
      },
      'Servicios Públicos': {
        description: 'Agua, electricidad, recolección de basura, transporte',
        color: 'primary'
      },
      'Transporte': {
        description: 'Transporte público, tráfico, estacionamiento',
        color: 'secondary'
      },
      'Salud': {
        description: 'Servicios de salud, centros médicos, emergencias',
        color: 'info'
      },
      'Educación': {
        description: 'Escuelas, centros educativos, programas académicos',
        color: 'success'
      },
      'Otros': {
        description: 'Problemas que no encajan en las categorías anteriores',
        color: 'secondary'
      }
    };
    return info[categoria] || { description: '', color: 'secondary' };
  };

  if (success) {
    return (
      <div className="fade-in">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center">
                <Card.Body className="py-5">
                  <div className="text-success mb-3">
                    <i className="bi bi-check-circle" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-success mb-3">¡Denuncia Creada!</h3>
                  <p className="text-muted mb-4">
                    Tu denuncia ha sido publicada exitosamente. Ahora la comunidad podrá verla y votar por ella.
                  </p>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <span>Redirigiendo...</span>
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
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card>
              <Card.Header className="bg-primary text-white">
                <h2 className="h4 mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nueva Denuncia
                </h2>
              </Card.Header>
              <Card.Body className="p-4">
                <Alert variant="info" className="mb-4">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                    <div>
                      <h6 className="alert-heading fw-bold mb-2">Información Importante</h6>
                      <ul className="small mb-0">
                        <li>Tu denuncia será <strong>completamente anónima</strong></li>
                        <li>Proporciona detalles específicos para mayor impacto</li>
                        <li>La comunidad votará para priorizar tu denuncia</li>
                        <li>Sé respetuoso y constructivo en tu reporte</li>
                      </ul>
                    </div>
                  </div>
                </Alert>

                {errors.general && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Título */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-card-text me-2"></i>
                      Título de la Denuncia <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Describe brevemente el problema..."
                      isInvalid={!!errors.titulo}
                      disabled={loading}
                      maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.titulo}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      {formData.titulo.length}/100 caracteres
                    </Form.Text>
                  </Form.Group>

                  {/* Categoría */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-tags me-2"></i>
                      Categoría <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      isInvalid={!!errors.categoria}
                      disabled={loading}
                    >
                      <option value="">Selecciona una categoría...</option>
                      {CATEGORIAS.map(categoria => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.categoria}
                    </Form.Control.Feedback>
                    
                    {/* Información de la categoría seleccionada */}
                    {formData.categoria && (
                      <div className="mt-2">
                        <Badge bg={getCategoriaInfo(formData.categoria).color} className="me-2">
                          {formData.categoria}
                        </Badge>
                        <small className="text-muted">
                          {getCategoriaInfo(formData.categoria).description}
                        </small>
                      </div>
                    )}
                  </Form.Group>

                  {/* Descripción */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-file-text me-2"></i>
                      Descripción Detallada <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Proporciona todos los detalles relevantes sobre el problema. ¿Dónde ocurre? ¿Cuándo? ¿Cómo afecta a la comunidad? ¿Qué soluciones propones?"
                      isInvalid={!!errors.descripcion}
                      disabled={loading}
                      maxLength={1000}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.descripcion}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      {formData.descripcion.length}/1000 caracteres. Sé específico y detallado.
                    </Form.Text>
                  </Form.Group>

                  {/* Botones */}
                  <div className="d-flex gap-3 justify-content-end">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/denuncias')}
                      disabled={loading}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary-custom"
                      disabled={loading || !formData.titulo || !formData.descripcion || !formData.categoria}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Publicando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Publicar Denuncia
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar con consejos */}
          <Col lg={4}>
            <Card className="sidebar">
              <Card.Body>
                <h5 className="sidebar-title">
                  <i className="bi bi-lightbulb me-2"></i>
                  Consejos para una Buena Denuncia
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-1-circle text-primary me-2 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Sé Específico</h6>
                      <small className="text-muted">
                        Incluye ubicación exacta, horarios y detalles concretos
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <i className="bi bi-2-circle text-primary me-2 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Propón Soluciones</h6>
                      <small className="text-muted">
                        Si tienes ideas de cómo resolver el problema, compártelas
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <i className="bi bi-3-circle text-primary me-2 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Sé Respetuoso</h6>
                      <small className="text-muted">
                        Mantén un tono constructivo y profesional
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <i className="bi bi-4-circle text-primary me-2 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Categoriza Bien</h6>
                      <small className="text-muted">
                        Elige la categoría más apropiada para mayor visibilidad
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="sidebar mt-3">
              <Card.Body>
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-shield-check me-2"></i>
                  Tu Privacidad
                </h6>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <small>Publicación anónima</small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <small>Sin datos personales</small>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <small>Protección total</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CrearDenuncia; 