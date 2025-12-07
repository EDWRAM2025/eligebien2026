/**
 * Módulo de Transparencia - Elige Bien 2026
 * Visualización de declaraciones juradas y datos patrimoniales
 */

let datosTransparencia = [];
let candidatoSeleccionado = null;

/**
 * Inicializa el módulo de transparencia
 */
async function initTransparencia() {
    try {
        // Cargar datos de transparencia
        const response = await fetch('./data/transparencia.json');
        datosTransparencia = await response.json();

        // Renderizar lista de candidatos
        renderizarListaCandidatos();

        // Configurar event listeners
        configurarEventListeners();

        console.log('Módulo de Transparencia inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar módulo de transparencia:', error);
        mostrarError('Error al cargar datos de transparencia');
    }
}

/**
 * Renderiza la lista de candidatos
 */
function renderizarListaCandidatos() {
    const container = document.getElementById('candidatos-list');
    if (!container) return;

    container.innerHTML = '';

    datosTransparencia.forEach(candidato => {
        const candidatoCard = crearCandidatoCard(candidato);
        container.appendChild(candidatoCard);
    });
}

/**
 * Crea una tarjeta de candidato
 */
function crearCandidatoCard(candidato) {
    const card = document.createElement('div');
    card.className = 'candidato-card';
    card.dataset.id = candidato.candidato_id;

    const estadoDeclaracion = candidato.indices.declaracion_completa
        ? '<span class="badge badge-success">✓ Declaración Completa</span>'
        : '<span class="badge badge-warning">⚠ Declaración Incompleta</span>';

    const colorScore = getColorScore(candidato.indices.transparencia);

    card.innerHTML = `
    <div class="candidato-header">
      <div class="candidato-info">
        <h3>${candidato.nombre}</h3>
        <p class="partido">${candidato.partido}</p>
      </div>
      <div class="score-badge" style="background: ${colorScore}">
        <div class="score-number">${candidato.indices.transparencia}</div>
        <div class="score-label">Índice</div>
      </div>
    </div>
    <div class="candidato-status">
      ${estadoDeclaracion}
      <span class="update-date">Actualizado: ${formatDate(candidato.indices.ultima_actualizacion)}</span>
    </div>
    <button class="btn btn-primary" onclick="verDetalles(${candidato.candidato_id})">
      Ver Declaración Completa
    </button>
  `;

    return card;
}

/**
 * Muestra los detalles completos de un candidato
 */
function verDetalles(candidatoId) {
    const candidato = datosTransparencia.find(c => c.candidato_id === candidatoId);
    if (!candidato) return;

    candidatoSeleccionado = candidato;

    // Actualizar información del modal
    const modal = document.getElementById('detalle-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = generarDetalleCompleto(candidato);

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Genera el HTML del detalle completo
 */
function generarDetalleCompleto(candidato) {
    const dj = candidato.declaracion_jurada;
    const totalActivos = calcularTotalActivos(candidato);
    const patrimonioNeto = totalActivos - dj.deudas;

    return `
    <div class="detalle-header">
      <h2>${candidato.nombre}</h2>
      <p class="partido">${candidato.partido}</p>
      <div class="score-large" style="background: ${getColorScore(candidato.indices.transparencia)}">
        ${candidato.indices.transparencia}/100
      </div>
    </div>

    <div class="detalle-section">
      <h3>📊 Resumen Patrimonial</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">S/ ${formatNumber(dj.ingresos_anuales)}</div>
          <div class="stat-label">Ingresos Anuales</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">S/ ${formatNumber(totalActivos)}</div>
          <div class="stat-label">Total Activos</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">S/ ${formatNumber(dj.deudas)}</div>
          <div class="stat-label">Deudas</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">S/ ${formatNumber(patrimonioNeto)}</div>
          <div class="stat-label">Patrimonio Neto</div>
        </div>
      </div>
    </div>

    <div class="detalle-section">
      <h3>🏠 Bienes Inmuebles</h3>
      ${generarListaBienes(dj.bienes_inmuebles)}
    </div>

    <div class="detalle-section">
      <h3>🚗 Vehículos</h3>
      ${generarListaVehiculos(dj.vehiculos)}
    </div>

    <div class="detalle-section">
      <h3>💰 Activos Financieros</h3>
      <div class="financial-grid">
        <div class="financial-item">
          <span class="label">Cuentas Bancarias:</span>
          <span class="value">S/ ${formatNumber(dj.cuentas_bancarias)}</span>
        </div>
        <div class="financial-item">
          <span class="label">Inversiones:</span>
          <span class="value">S/ ${formatNumber(dj.inversiones)}</span>
        </div>
      </div>
    </div>

    <div class="detalle-section">
      <h3>⚖️ Historial Legal</h3>
      ${generarHistorialLegal(candidato.historial)}
    </div>

    <div class="detalle-footer">
      <p><strong>Fuente:</strong> ${candidato.indices.fuente_verificacion}</p>
      <p><strong>Última Actualización:</strong> ${formatDate(candidato.indices.ultima_actualizacion)}</p>
      <a href="https://portal.jne.gob.pe" target="_blank" class="btn btn-secondary">
        Verificar en JNE ↗
      </a>
    </div>
  `;
}

/**
 * Genera lista de bienes inmuebles
 */
function generarListaBienes(bienes) {
    if (!bienes || bienes.length === 0) {
        return '<p class="empty-state">No hay bienes inmuebles declarados</p>';
    }

    return `
    <div class="bienes-list">
      ${bienes.map(bien => `
        <div class="bien-item">
          <div class="bien-tipo">${bien.tipo}</div>
          <div class="bien-ubicacion">📍 ${bien.ubicacion}</div>
          <div class="bien-details">
            <span>Valor: S/ ${formatNumber(bien.valor_estimado)}</span>
            <span>Adquirido: ${bien.año_adquisicion}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Genera lista de vehículos
 */
function generarListaVehiculos(vehiculos) {
    if (!vehiculos || vehiculos.length === 0) {
        return '<p class="empty-state">No hay vehículos declarados</p>';
    }

    return `
    <div class="vehiculos-list">
      ${vehiculos.map(vehiculo => `
        <div class="vehiculo-item">
          <div class="vehiculo-nombre">${vehiculo.marca} ${vehiculo.modelo}</div>
          <div class="vehiculo-valor">S/ ${formatNumber(vehiculo.valor_estimado)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Genera historial legal
 */
function generarHistorialLegal(historial) {
    const items = [
        { label: 'Sanciones Administrativas', value: historial.sanciones_administrativas },
        { label: 'Procesos Judiciales', value: historial.procesos_judiciales },
        { label: 'Inhabilitaciones', value: historial.inhabilitaciones }
    ];

    return `
    <div class="legal-grid">
      ${items.map(item => {
        const hasIssues = item.value > 0;
        const icon = hasIssues ? '⚠️' : '✅';
        const cssClass = hasIssues ? 'has-issues' : 'clean';

        return `
          <div class="legal-item ${cssClass}">
            <span class="icon">${icon}</span>
            <span class="label">${item.label}:</span>
            <span class="value">${item.value}</span>
          </div>
        `;
    }).join('')}
    </div>
  `;
}

/**
 * Calcula el total de activos
 */
function calcularTotalActivos(candidato) {
    const dj = candidato.declaracion_jurada;

    const totalInmuebles = dj.bienes_inmuebles.reduce((sum, bien) => sum + bien.valor_estimado, 0);
    const totalVehiculos = dj.vehiculos.reduce((sum, vehiculo) => sum + vehiculo.valor_estimado, 0);

    return totalInmuebles + totalVehiculos + dj.cuentas_bancarias + dj.inversiones;
}

/**
 * Configura event listeners
 */
function configurarEventListeners() {
    // Cerrar modal
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModal);
    }

    // Cerrar modal al hacer click fuera
    const modal = document.getElementById('detalle-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    const modal = document.getElementById('detalle-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Obtiene color según score de transparencia
 */
function getColorScore(score) {
    if (score >= 80) return 'linear-gradient(135deg, #10b981, #059669)';
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
}

/**
 * Formatea fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-PE', options);
}

/**
 * Formatea números con separador de miles
 */
function formatNumber(num) {
    return num.toLocaleString('es-PE');
}

/**
 * Muestra mensaje de error
 */
function mostrarError(mensaje) {
    const container = document.getElementById('candidatos-list');
    if (container) {
        container.innerHTML = `
      <div class="error-message">
        <p>⚠️ ${mensaje}</p>
        <button onclick="initTransparencia()" class="btn btn-primary">Reintentar</button>
      </div>
    `;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initTransparencia);
