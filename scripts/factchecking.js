/**
 * Fact-Checking Module
 * Sistema de verificación de declaraciones de candidatos
 */

let todasLasVerificaciones = [];
let verificacionesFiltradas = [];
let veredictos = {};

// Inicializar módulo de fact-checking
async function iniciarFactChecking() {
    try {
        // Cargar verificaciones
        const response = await fetch('data/verificaciones.json');
        if (!response.ok) throw new Error('Error al cargar verificaciones');

        const data = await response.json();
        todasLasVerificaciones = data.verificaciones;
        veredictos = data.veredictos;
        verificacionesFiltradas = [...todasLasVerificaciones];

        // Renderizar verificaciones
        renderizarVerificaciones();

        // Configurar filtros
        configurarFiltros();

        console.log('Fact-checking inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando fact-checking:', error);
        mostrarError('Error al cargar las verificaciones');
    }
}

// Renderizar verificaciones
function renderizarVerificaciones() {
    const contenedor = document.getElementById('verificaciones-lista');

    if (verificacionesFiltradas.length === 0) {
        contenedor.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">🔍 No se encontraron verificaciones con los filtros seleccionados</p>
      </div>
    `;
        return;
    }

    contenedor.innerHTML = verificacionesFiltradas.map(v => {
        const veredicto = veredictos[v.veredicto];

        return `
      <div class="verificacion-card" style="background: white; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid ${veredicto.color};">
        <div class="verificacion-header" style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
            <div style="flex: 1;">
              <h3 style="color: var(--text-dark); margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                "${v.declaracion}"
              </h3>
              <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem;">
                <strong>${v.candidato_nombre}</strong> - ${formatearFecha(v.fecha)}
              </p>
            </div>
            <div class="veredicto-badge" style="background: ${veredicto.color}; color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 700; white-space: nowrap;">
              ${veredicto.emoji} ${veredicto.nombre}
            </div>
          </div>
        </div>
        
        <div class="verificacion-contenido">
          <div style="background: var(--bg-light); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <h4 style="color: var(--primary-color); margin: 0 0 0.5rem 0; font-size: 1rem;">
              📋 Análisis
            </h4>
            <p style="color: var(--text-dark); margin: 0; line-height: 1.6;">
              ${v.explicacion}
            </p>
          </div>
          
          <div class="fuentes" style="margin-top: 1rem;">
            <h4 style="color: var(--primary-color); margin: 0 0 0.5rem 0; font-size: 0.9rem;">
              🔗 Fuentes
            </h4>
            <ul style="margin: 0; padding-left: 1.5rem; color: var(--text-muted);">
              ${v.fuentes.map(fuente => `
                <li style="margin-bottom: 0.25rem;">
                  ${fuente.startsWith('http') ?
                `<a href="${fuente}" target="_blank" rel="noopener" style="color: var(--primary-color);">${fuente}</a>` :
                fuente
            }
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Actualizar contador
    actualizarContador();
}

// Configurar filtros
function configurarFiltros() {
    // Filtro por candidato
    const filtroCandidato = document.getElementById('filtro-candidato');
    filtroCandidato.addEventListener('change', aplicarFiltros);

    // Filtro por veredicto
    const filtroVeredicto = document.getElementById('filtro-veredicto');
    filtroVeredicto.addEventListener('change', aplicarFiltros);

    // Búsqueda
    const busqueda = document.getElementById('busqueda');
    busqueda.addEventListener('input', debounce(aplicarFiltros, 300));
}

// Aplicar filtros
function aplicarFiltros() {
    const candidatoSeleccionado = document.getElementById('filtro-candidato').value;
    const veredictoSeleccionado = document.getElementById('filtro-veredicto').value;
    const terminoBusqueda = document.getElementById('busqueda').value.toLowerCase();

    verificacionesFiltradas = todasLasVerificaciones.filter(v => {
        // Filtro por candidato
        if (candidatoSeleccionado && v.candidato_id !== candidatoSeleccionado) {
            return false;
        }

        // Filtro por veredicto
        if (veredictoSeleccionado && v.veredicto !== veredictoSeleccionado) {
            return false;
        }

        // Búsqueda en declaración o explicación
        if (terminoBusqueda) {
            const enDeclaracion = v.declaracion.toLowerCase().includes(terminoBusqueda);
            const enExplicacion = v.explicacion.toLowerCase().includes(terminoBusqueda);
            if (!enDeclaracion && !enExplicacion) {
                return false;
            }
        }

        return true;
    });

    renderizarVerificaciones();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtro-candidato').value = '';
    document.getElementById('filtro-veredicto').value = '';
    document.getElementById('busqueda').value = '';
    aplicarFiltros();
}

// Actualizar contador
function actualizarContador() {
    const contador = document.getElementById('contador-verificaciones');
    if (contador) {
        contador.textContent = `Mostrando ${verificacionesFiltradas.length} de ${todasLasVerificaciones.length} verificaciones`;
    }
}

// Formatear fecha
function formatearFecha(fecha) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const d = new Date(fecha + 'T00:00:00');
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Mostrar error
function mostrarError(mensaje) {
    const contenedor = document.getElementById('verificaciones-lista');
    contenedor.innerHTML = `
    <div style="text-align: center; padding: 2rem; background: rgba(220, 20, 60, 0.1); border-radius: 0.5rem;">
      <p style="color: var(--accent-color); font-weight: 600;">❌ ${mensaje}</p>
    </div>
  `;
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarFactChecking);
} else {
    iniciarFactChecking();
}
