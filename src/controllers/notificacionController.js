import notificacionService from '../services/notificacionService.js';

async function citaConfirmada(req, res) {
  try {
    const { destinatarioId, citaId, fechaCita, canal } = req.body;

    if (!destinatarioId || !citaId || !fechaCita || !canal) {
      return res.status(400).json({
        error: 'destinatarioId, citaId, fechaCita y canal son obligatorios',
      });
    }

    const resultado = await notificacionService.procesarCitaConfirmada({
      destinatarioId,
      citaId,
      fechaCita,
      canal,
    });

    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function matriculaCreada(req, res) {
  try {
    const { destinatarioId, matriculaId, canal } = req.body;

    if (!destinatarioId || !matriculaId || !canal) {
      return res.status(400).json({
        error: 'destinatarioId, matriculaId y canal son obligatorios',
      });
    }

    const notificacion = await notificacionService.procesarMatriculaCreada({
      destinatarioId,
      matriculaId,
      canal,
    });

    res.status(201).json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function certificadoGenerado(req, res) {
  try {
    const { destinatarioId, certificadoId, canal } = req.body;

    if (!destinatarioId || !certificadoId || !canal) {
      return res.status(400).json({
        error: 'destinatarioId, certificadoId y canal son obligatorios',
      });
    }

    const notificacion = await notificacionService.procesarCertificadoGenerado({
      destinatarioId,
      certificadoId,
      canal,
    });

    res.status(201).json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listarPorDestinatario(req, res) {
  try {
    const notificaciones = await notificacionService.listarPorDestinatario(
      req.params.destinatarioId
    );
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPorId(req, res) {
  try {
    const notificacion = await notificacionService.obtenerPorId(req.params.id);

    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    res.json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default {
  citaConfirmada,
  matriculaCreada,
  certificadoGenerado,
  listarPorDestinatario,
  obtenerPorId,
};