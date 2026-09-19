import cron from 'node-cron';
import notificacionService from '../services/notificacionService.js';

export function iniciarScheduler() {
  // Corre cada minuto: revisa si algún recordatorio (24h o 2h antes de
  // la cita) ya llegó a su hora programada, y lo envía. RF-NO-02.
  cron.schedule('* * * * *', async () => {
    const enviados = await notificacionService.procesarPendientes();
    if (enviados > 0) {
      console.log(`[scheduler] ${enviados} notificación(es) programada(s) enviada(s).`);
    }
  });

  console.log('Scheduler de recordatorios iniciado (revisa cada 1 minuto).');
}