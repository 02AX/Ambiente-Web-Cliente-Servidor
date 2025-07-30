import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { formatearTiempoRelativo } from '../utils/dateUtils.js';
import { obtenerUsuarioPorId } from '../models/demoData.js';
import { obtenerIniciales, generarColorPorTexto } from '../utils/generalUtils.js';

const ComentarioItem = ({ comentario }) => {
  const usuario = obtenerUsuarioPorId(comentario.usuarioId);
  const displayName = usuario ? usuario.getDisplayName() : 'Usuario Anónimo';
  const iniciales = obtenerIniciales(displayName);
  const colorAvatar = generarColorPorTexto(displayName);

  return (
    <Card className="comentario-item border-0 shadow-custom">
      <Card.Body className="p-3">
        <Row className="align-items-start">
          <Col xs="auto">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: colorAvatar,
                fontSize: '0.875rem'
              }}
            >
              {iniciales}
            </div>
          </Col>
          
          <Col>
            <div className="d-flex align-items-center gap-2 mb-2">
              <h6 className="comentario-autor mb-0">
                {displayName}
              </h6>
              {comentario.anonimo && (
                <Badge bg="secondary" className="small">
                  <i className="bi bi-shield-lock me-1"></i>
                  Anónimo
                </Badge>
              )}
            </div>
            
            <p className="mb-2">
              {comentario.contenido}
            </p>
            
            <div className="d-flex align-items-center justify-content-between">
              <small className="comentario-fecha">
                <i className="bi bi-clock me-1"></i>
                {formatearTiempoRelativo(comentario.fechaCreacion)}
              </small>
              
              {comentario.likes > 0 && (
                <div className="d-flex align-items-center text-muted">
                  <i className="bi bi-heart-fill me-1" style={{ color: '#ef4444' }}></i>
                  <small>{comentario.likes}</small>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ComentarioItem; 