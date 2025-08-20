import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { truncarTexto } from '../utils/generalUtils.js';
import { formatearTiempoRelativo } from '../utils/dateUtils.js';
import denunciaController from '../controllers/DenunciaController.js';
import authController from '../controllers/AuthController.js';

const DenunciaCard = ({ denuncia, showFullDescription = false, onUpdate }) => {
  const [likes, setLikes] = useState(denuncia.likes);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const hasLiked = await denunciaController.hasUserLikedDenuncia(denuncia.id);
      if (!cancelled) setLiked(hasLiked);
    })();
    return () => { cancelled = true; };
  }, [denuncia.id]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authController.isUserAuthenticated()) {
      alert('Debe iniciar sesión para dar like');
      return;
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    const result = await denunciaController.toggleLikeDenuncia(denuncia.id);
    
    if (result.success) {
      setLikes(result.likes);
      setLiked(result.liked);
      
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.message);
    }
    
    setIsLiking(false);
  };

  const getCategoriaColor = () => {
    const colores = {
      'Seguridad': 'danger',
      'Infraestructura': 'warning',
      'Medio Ambiente': 'success',
      'Servicios Públicos': 'primary',
      'Transporte': 'secondary',
      'Salud': 'info',
      'Educación': 'success',
      'Otros': 'secondary'
    };
    return colores[denuncia.categoria] || 'secondary';
  };

  return (
    <Card className="denuncia-card h-100 fade-in">
      <Card.Body>
        <div className="denuncia-header">
          <Badge bg={getCategoriaColor()} className="mb-2">
            {denuncia.categoria}
          </Badge>
          <div className="likes-section">
            <Button
              variant="link"
              className={`like-button p-0 ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
              title={liked ? 'Quitar like' : 'Dar like'}
            >
              <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </Button>
            <span className="likes-count ms-1">{likes}</span>
          </div>
        </div>
        
        <Card.Title>
          <Link 
            to={`/denuncias/${denuncia.id}`} 
            className="text-decoration-none text-dark"
          >
            {denuncia.titulo}
          </Link>
        </Card.Title>
        
        <Card.Text className="text-muted-custom">
          {showFullDescription 
            ? denuncia.descripcion 
            : truncarTexto(denuncia.descripcion, 150)
          }
        </Card.Text>
        
        <Row className="align-items-center text-muted-custom small">
          <Col>
            <i className="bi bi-clock me-1"></i>
            {formatearTiempoRelativo(denuncia.fechaCreacion)}
          </Col>
          <Col xs="auto">
            <i className="bi bi-chat me-1"></i>
            {(denuncia.comentarios?.length || 0)} comentario{(denuncia.comentarios?.length || 0) !== 1 ? 's' : ''}
          </Col>
        </Row>
      </Card.Body>
      
      {!showFullDescription && (
        <Card.Footer className="bg-transparent border-top-0">
          <Link 
            to={`/denuncias/${denuncia.id}`}
            className="btn btn-outline-primary btn-sm"
          >
            Ver detalles
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </Card.Footer>
      )}
    </Card>
  );
};

export default DenunciaCard; 