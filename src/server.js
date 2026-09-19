import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { iniciarScheduler } from './config/scheduler.js';
import notificacionRoutes from './routes/notificacionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-notificaciones' });
});

app.use('/api/notificaciones', notificacionRoutes);

async function iniciar() {
  await connectDB();
  iniciarScheduler();

  app.listen(PORT, () => {
    console.log(`MS-Notificaciones corriendo en el puerto ${PORT}`);
  });
}

iniciar();