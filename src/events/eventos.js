// TODO: cuando se defina el contrato de eventos con Camilo (MS-Citas) y
// David (MS-Academia), este archivo va a conectarse a RabbitMQ (amqplib)
// y escuchar los eventos:
//
//   - "cita.confirmada"      -> llama a notificacionService.procesarCitaConfirmada()
//   - "matricula.creada"     -> llama a notificacionService.procesarMatriculaCreada()
//   - "certificado.generado" -> llama a notificacionService.procesarCertificadoGenerado()
//
// Mientras tanto, esa misma lógica se puede probar manualmente a través
// de los endpoints POST /api/notificaciones/* (ver routes/notificacionRoutes.js). 