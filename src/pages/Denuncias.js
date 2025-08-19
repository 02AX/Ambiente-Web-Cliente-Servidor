import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, ButtonGroup, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DenunciaCard from '../components/DenunciaCard.js';
import denunciaController from '../controllers/DenunciaController.js';
import { CATEGORIAS } from '../models/Denuncia.js';
import { debounce } from '../utils/generalUtils.js';

const Denuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasFiltradas, setDenunciasFiltradas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('likes');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDenuncias();
  }, [ordenamiento]);

  useEffect(() => {
    aplicarFiltros();
  }, [denuncias, categoriaSeleccionada, busqueda]);

  const cargarDenuncias = async () => {
    setLoading(true);
    try {
      const denunciasOrdenadas = await denunciaController.getDenunciasOrdenadas(ordenamiento);
      setDenuncias(denunciasOrdenadas);
    } catch (e) {
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...denuncias];

    // Filtrar por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter(denuncia => denuncia.categoria === categoriaSeleccionada);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(denuncia =>
        denuncia.titulo.toLowerCase().includes(terminoBusqueda) ||
        denuncia.descripcion.toLowerCase().includes(terminoBusqueda)
      );
    }

    setDenunciasFiltradas(resultado);
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria === categoriaSeleccionada ? '' : categoria);
  };

  const handleOrdenamientoChange = (criterio) => {
    setOrdenamiento(criterio);
  };

  const handleBusquedaChange = debounce((valor) => {
    setBusqueda(valor);
  }, 300);

  const handleUpdate = () => {
    cargarDenuncias();
  };

  const limpiarFiltros = () => {
    setCategoriaSeleccionada('');
    setBusqueda('');
    document.getElementById('search-input').value = '';
  };

  return (
    <div className="fade-in">
      <Container>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold">
              <i className="bi bi-exclamation-triangle me-3"></i>
              Todas las Denuncias
            </h1>
            <p className="text-muted">
              Explora y vota por los problemas más importantes de la comunidad
            </p>
          </div>
          <Link to="/denuncias/crear" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Denuncia
          </Link>
        </div>

        <Row>
          {/* Sidebar de Filtros */}
          <Col lg={3}>
            <Card className="sidebar mb-4">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="sidebar-title mb-0">
                    <i className="bi bi-funnel me-2"></i>
                    Filtros
                  </h5>
                  {(categoriaSeleccionada || busqueda) && (
                    <Button variant="link" size="sm" onClick={limpiarFiltros}>
                      Limpiar
                    </Button>
                  )}
                </div>

                {/* Búsqueda */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Buscar</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      id="search-input"
                      type="text"
                      placeholder="Buscar denuncias..."
                      onChange={(e) => handleBusquedaChange(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Filtro por Categoría */}
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Categorías</Form.Label>
                  <div className="d-flex flex-column gap-2">
                    {CATEGORIAS.map(categoria => {
                      const count = denuncias.filter(d => d.categoria === categoria).length;
                      return (
                        <Button
                          key={categoria}
                          variant={categoriaSeleccionada === categoria ? 'primary' : 'outline-secondary'}
                          size="sm"
                          className="text-start"
                          onClick={() => handleCategoriaChange(categoria)}
                        >
                          <span>{categoria}</span>
                          <span className="float-end">({count})</span>
                        </Button>
                      );
                    })}
                  </div>
                </Form.Group>

                {/* Estadísticas */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Estadísticas</h6>
                  <div className="small">
                    <div className="d-flex justify-content-between">
                      <span>Total denuncias:</span>
                      <strong>{denuncias.length}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Mostrando:</span>
                      <strong>{denunciasFiltradas.length}</strong>
                    </div>
                    {categoriaSeleccionada && (
                      <div className="d-flex justify-content-between">
                        <span>Categoría:</span>
                        <strong>{categoriaSeleccionada}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contenido Principal */}
          <Col lg={9}>
            {/* Controles de Ordenamiento */}
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div>
                    <h6 className="mb-1">
                      <i className="bi bi-sort-down me-2"></i>
                      Ordenar por:
                    </h6>
                  </div>
                  <ButtonGroup size="sm">
                    <Button
                      variant={ordenamiento === 'likes' ? 'primary' : 'outline-primary'}
                      onClick={() => handleOrdenamientoChange('likes')}
                    >
                      <i className="bi bi-heart-fill me-1"></i>
                      Más Populares
                    </Button>
                    <Button
                      variant={ordenamiento === 'fecha' ? 'primary' : 'outline-primary'}
                      onClick={() => handleOrdenamientoChange('fecha')}
                    >
                      <i className="bi bi-clock me-1"></i>
                      Más Recientes
                    </Button>
                    <Button
                      variant={ordenamiento === 'comentarios' ? 'primary' : 'outline-primary'}
                      onClick={() => handleOrdenamientoChange('comentarios')}
                    >
                      <i className="bi bi-chat me-1"></i>
                      Más Comentadas
                    </Button>
                  </ButtonGroup>
                </div>
              </Card.Body>
            </Card>

            {/* Lista de Denuncias */}
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : denunciasFiltradas.length > 0 ? (
              <Row className="g-3">
                {denunciasFiltradas.map(denuncia => (
                  <Col key={denuncia.id} md={6} xl={4}>
                    <DenunciaCard denuncia={denuncia} onUpdate={handleUpdate} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center">
                <Card.Body className="py-5">
                  <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">No se encontraron denuncias</h5>
                  <p className="text-muted">
                    {busqueda || categoriaSeleccionada
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Aún no hay denuncias publicadas'
                    }
                  </p>
                  {(busqueda || categoriaSeleccionada) && (
                    <Button variant="outline-primary" onClick={limpiarFiltros}>
                      Limpiar filtros
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Denuncias; 