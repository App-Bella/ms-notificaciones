import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    // No detenemos el proceso: /health sigue respondiendo mientras se
    // soluciona la conexión (útil en desarrollo si Docker aún no levanta).
  }
}