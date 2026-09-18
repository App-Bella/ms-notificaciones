import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta de prueba - salud del servicio
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-notificaciones' });
});

app.listen(PORT, () => {
  console.log(`MS-Notificaciones corriendo en el puerto ${PORT}`);
});