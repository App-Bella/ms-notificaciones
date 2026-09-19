import Notificacion from '../model/Notificacion.js';

// TODO: reemplazar por integración real (Twilio para WhatsApp,
// Nodemailer/SendGrid para Email). Por ahora se simula con un log.
async function simularEnvio(notificacion) {
  console.log(`[${notificacion.canal}] -> ${notificacion.destinatarioId}: ${notificacion.mensaje}`);
  notificacion.estado = 'ENVIADO';
  notificacion.fechaEnvio = new Date();
  await notificacion.save();
  return notificacion;
}

async function enviarInmediata({ destinatarioId, tipo, referenciaId, canal, mensaje }) {
  const notificacion = new Notificacion({
    destinatarioId,
    canal,
    tipo,
    mensaje,
    referenciaId,
  });
  await notificacion.save();
  return simularEnvio(notificacion);
}

async function programarRecordatorio({ destinatarioId, tipo, referenciaId, canal, mensaje, programadoPara }) {
  const notificacion = new Notificacion({
    destinatarioId,
    canal,
    tipo,
    mensaje,
    referenciaId,
    programadoPara,
  });
  await notificacion.save();
  return notificacion;
}

// RF-NO-01 (confirmación inmediata) + RF-NO-02 (programa los 2 recordatorios).
// TODO: cuando se defina el contrato de eventos, esta función la va a llamar
// un listener de RabbitMQ al recibir "cita.confirmada" desde MS-Citas,
// en vez del endpoint manual.
async function procesarCitaConfirmada({ destinatarioId, citaId, fechaCita, canal }) {
  const fecha = new Date(fechaCita);

  const confirmacion = await enviarInmediata({
    destinatarioId,
    tipo: 'CONFIRMACION_CITA',
    referenciaId: citaId,
    canal,
    mensaje: `Tu cita ha sido confirmada para el ${fecha.toLocaleString('es-CO')}.`,
  });

  const momento24h = new Date(fecha.getTime() - 24 * 60 * 60 * 1000);
  const momento2h = new Date(fecha.getTime() - 2 * 60 * 60 * 1000);

  const recordatorio24h = await programarRecordatorio({
    destinatarioId,
    tipo: 'RECORDATORIO_24H',
    referenciaId: citaId,
    canal,
    mensaje: `Recordatorio: tienes una cita mañana, ${fecha.toLocaleString('es-CO')}.`,
    programadoPara: momento24h,
  });

  const recordatorio2h = await programarRecordatorio({
    destinatarioId,
    tipo: 'RECORDATORIO_2H',
    referenciaId: citaId,
    canal,
    mensaje: `Recordatorio: tu cita es en 2 horas (${fecha.toLocaleString('es-CO')}).`,
    programadoPara: momento2h,
  });

  return { confirmacion, recordatorio24h, recordatorio2h };
}

// RF-NO-01 para matrículas.
// TODO: futuro listener de "matricula.creada" desde MS-Academia.
async function procesarMatriculaCreada({ destinatarioId, matriculaId, canal }) {
  return enviarInmediata({
    destinatarioId,
    tipo: 'CONFIRMACION_MATRICULA',
    referenciaId: matriculaId,
    canal,
    mensaje: 'Tu matrícula ha sido registrada exitosamente. ¡Bienvenida a PonteBella!',
  });
}

// TODO: futuro listener de "certificado.generado" desde MS-Academia.
async function procesarCertificadoGenerado({ destinatarioId, certificadoId, canal }) {
  return enviarInmediata({
    destinatarioId,
    tipo: 'CERTIFICADO_GENERADO',
    referenciaId: certificadoId,
    canal,
    mensaje: '¡Felicidades! Tu certificado ya está disponible.',
  });
}

async function listarPorDestinatario(destinatarioId) {
  return Notificacion.find({ destinatarioId }).sort({ fechaCreacion: -1 });
}

async function obtenerPorId(id) {
  return Notificacion.findById(id);
}

// Llamado por el scheduler (node-cron) cada minuto: envía lo que ya
// llegó a su hora programada (RF-NO-02).
async function procesarPendientes() {
  const ahora = new Date();
  const pendientes = await Notificacion.find({
    estado: 'PENDIENTE',
    programadoPara: { $lte: ahora },
  });

  for (const notificacion of pendientes) {
    await simularEnvio(notificacion);
  }

  return pendientes.length;
}

export default {
  procesarCitaConfirmada,
  procesarMatriculaCreada,
  procesarCertificadoGenerado,
  listarPorDestinatario,
  obtenerPorId,
  procesarPendientes,
};