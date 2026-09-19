import { Router } from 'express';
import notificacionController from '../controllers/notificacionController.js';

const router = Router();

// RF-NO-01 + RF-NO-02: simula lo que hará el evento "cita.confirmada"
router.post('/cita-confirmada', notificacionController.citaConfirmada);

// RF-NO-01: simula el evento "matricula.creada"
router.post('/matricula-creada', notificacionController.matriculaCreada);

// Notificación al generarse un certificado (RF-AC-03 en Academia)
router.post('/certificado-generado', notificacionController.certificadoGenerado);

router.get('/destinatario/:destinatarioId', notificacionController.listarPorDestinatario);
router.get('/:id', notificacionController.obtenerPorId);

export default router;