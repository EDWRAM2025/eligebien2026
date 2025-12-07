/**
 * Contador Regresivo - Elecciones Generales 2026
 * Actualiza en tiempo real hasta el día de las elecciones
 */

// Fecha de las Elecciones Generales 2026 - 12 de abril de 2026, 7:00 AM (hora de Perú)
const ELECTION_DATE = new Date('2026-04-12T07:00:00-05:00');

function updateCountdown() {
    const now = new Date();
    const diff = ELECTION_DATE - now;

    // Si ya pasó la fecha
    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = `
      <div class="countdown-container">
        <h2>¡Hoy es el día de las Elecciones Generales 2026!</h2>
        <p class="election-date">Las mesas de votación están abiertas de 7:00 AM a 5:00 PM</p>
      </div>
    `;
        return;
    }

    // Calcular días, horas, minutos y segundos
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Actualizar el HTML
    document.getElementById('countdown').innerHTML = `
    <div class="countdown-container">
      <h2>Faltan para las Elecciones Generales 2026</h2>
      <div class="countdown-timer">
        <div class="time-unit">
          <span class="time-value">${days}</span>
          <span class="time-label">Días</span>
        </div>
        <div class="time-unit">
          <span class="time-value">${hours}</span>
          <span class="time-label">Horas</span>
        </div>
        <div class="time-unit">
          <span class="time-value">${minutes}</span>
          <span class="time-label">Minutos</span>
        </div>
        <div class="time-unit">
          <span class="time-value">${seconds}</span>
          <span class="time-label">Segundos</span>
        </div>
      </div>
      <p class="election-date">Domingo 12 de Abril de 2026 - 7:00 AM</p>
    </div>
  `;
}

// Iniciar el contador
function initCountdown() {
    // Ejecutar inmediatamente
    updateCountdown();

    // Actualizar cada segundo
    setInterval(updateCountdown, 1000);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
} else {
    initCountdown();
}
