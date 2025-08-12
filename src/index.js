import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let denuncias = [
    {
    id: '1',
    titulo: 'Bache en la calle principal',
    descripcion: 'Hay un bache grande frente a la escuela.',
    categoria: 'Infraestructura',
    votos: 5,
    fecha: new Date('2025-08-01').toISOString()
    },
    {
    id: '2',
    titulo: 'Luz pública apagada',
    descripcion: 'La luz del parque central no funciona.',
    categoria: 'Servicios',
    votos: 3,
    fecha: new Date('2025-08-03').toISOString()
  }
];

app.get('/api/denuncias', (req, res) => {
    res.json(denuncias);
});

app.post('/api/denuncias', (req, res) => {
    const { titulo, descripcion, categoria } = req.body;
    if(!titulo || !categoria) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const nueva = {
        id: String(Date.now()),
        titulo,
        descripcion: descripcion || '',
        categoria,
        votos: 0,
        fecha: new Date().toISOString()
    };
    denuncias.push(nueva);
    res.status(201).json(nueva);
});


app.post('/api/denuncias/votar/:id', (req, res) => {
    const { id } = req.params;
    const denuncia = denuncias.find(d => d.id === id);
    if (!denuncia) return res.status(404).json({ error: 'La denuncia no fue encontrada'});
    denuncia.votos++;
    res.json(denuncia);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});