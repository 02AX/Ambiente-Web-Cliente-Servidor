import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { seedFirestoreDemoData } from '../utils/firebaseSeed.js';

const DevSeed = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setStatus('running');
    setMessage('');
    try {
      await seedFirestoreDemoData();
      setStatus('done');
      setMessage('Datos demo cargados en Firestore.');
    } catch (e) {
      setStatus('error');
      setMessage('Error al sembrar datos: ' + (e?.message || 'desconocido'));
    }
  };

  return (
    <div className="fade-in">
      <Container className="py-5">
        <Card className="mx-auto" style={{ maxWidth: 600 }}>
          <Card.Body>
            <h3 className="mb-3">Seeding de Datos (Dev)</h3>
            <p className="text-muted">Carga los datos demo en Firestore. Usa solo en desarrollo.</p>
            {message && (
              <Alert variant={status === 'error' ? 'danger' : 'success'}>{message}</Alert>
            )}
            <Button onClick={handleSeed} disabled={status === 'running'}>
              {status === 'running' ? 'Cargando...' : 'Cargar datos demo'}
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DevSeed;


