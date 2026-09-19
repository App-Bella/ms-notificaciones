import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema(
  {
    // Referencia al usuario en MS-Usuarios (no se guarda el usuario completo aquí)
    destinatarioId: { type: String, required: true },

    canal: {
      type: String,
      enum: ['EMAIL', 'WHATSAPP'],
      required: true,
    },

    tipo: {
      type: String,
      enum: [
        'CONFIRMACION_CITA',
        'CONFIRMACION_MATRICULA',
        'RECORDATORIO_24H',
        'RECORDATORIO_2H',
        'CERTIFICADO_GENERADO',
      ],
      required: true,
    },

    mensaje: { type: String, required: true },

    estado: {
      type: String,
      enum: ['PENDIENTE', 'ENVIADO', 'FALLIDO'],
      default: 'PENDIENTE',
    },

    // Id de la cita, matrícula o certificado que originó esta notificación
    referenciaId: { type: String },

    // Fecha/hora en la que debe enviarse. Null = inmediata.
    // RF-NO-02: aquí se guarda "fechaCita - 24h" o "fechaCita - 2h".
    programadoPara: { type: Date, default: null },

    fechaEnvio: { type: Date },
  },
  {
    timestamps: { createdAt: 'fechaCreacion', updatedAt: false },
  }
);

export default mongoose.model('Notificacion', notificacionSchema);