/**
 * Comparador de Candidatos
 * Permite seleccionar y comparar candidatos lado a lado
 */

let candidatosSeleccionados = [];
let todosLosCandidatos = [];
let categoriaActual = 'economia';

// Inicializar comparador
async function iniciarlComparador() {
    try {
        // Cargar candidatos
        todosLosCandidatos = await cargarCandidatos();

        // Renderizar selectores
        renderizarSelectores();

        // Configurar event listeners
        configurarEventos();

        console.log('Comparador inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando comparador:', error);
        mostrarError('Error al cargar los datos de candidatos');
    }
}

// Renderizar selectores de candidatos
function renderizarSelectores() {
    const selectores = document.querySelectorAll('.candidato-selector');

    selectores.forEach((selector, index) => {
        selector.innerHTML = `
      <option value="">Selecciona un candidato</option>
      ${todosLosCandidatos.map(c => `
        <option value="${c.id}">${c.nombre} (${c.siglas})</option>
      `).join('')}
    `;

        // Event listener para cada selector
        selector.addEventListener('change', (e) => {
            seleccionarCandidato(index, e.target.value);
        });
    });
}

// Seleccionar candidato
function seleccionarCandidato(posicion, candidatoId) {
    if (candidatoId === '') {
        candidatosSeleccionados[posicion] = null;
    } else {
        const candidato = todosLosCandidatos.find(c => c.id === candidatoId);
        candidatosSeleccionados[posicion] = candidato;
    }

    actualizarComparacion();
}

// Actualizar visualización de comparación
function actualizarComparacion() {
    const contenedorComparacion = document.getElementById('comparacion-grid');

    if (candidatosSeleccionados.filter(c => c !== null).length === 0) {
        contenedorComparacion.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">👆 Selecciona al menos un candidato para comenzar la comparación</p>
      </div>
    `;
        return;
    }

    contenedorComparacion.innerHTML = candidatosSeleccionados.map((candidato, index) => {
        if (!candidato) return '<div></div>';

        return `
      <div class="candidato-card">
        <div class="candidato-header" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 1.5rem; border-radius: 0.5rem 0.5rem 0 0;">
          <div style="width: 100px; height: 100px; background: white; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
            👤
          </div>
          <h3 style="color: white; margin: 0;">${candidato.nombre}</h3>
          <p style="opacity: 0.9; margin: 0.5rem 0 0;">${candidato.partido} (${candidato.siglas})</p>
        </div>
        
        <div class="candidato-info" style="padding: 1.5rem;">
          <div class="info-item" style="margin-bottom: 1rem;">
            <strong style="color: var(--primary-color);">Edad:</strong> ${candidato.edad} años
          </div>
          <div class="info-item" style="margin-bottom: 1rem;">
            <strong style="color: var(--primary-color);">Profesión:</strong> ${candidato.profesion}
          </div>
          <div class="info-item" style="margin-bottom: 1rem;">
            <strong style="color: var(--primary-color);">Experiencia:</strong><br>
            <span style="color: var(--text-muted);">${candidato.experiencia}</span>
          </div>
          <div class="info-item" style="margin-bottom: 1rem;">
            <strong style="color: var(--primary-color);">Índice de Transparencia:</strong>
            <div style="background: var(--bg-light); border-radius: 0.5rem; height: 30px; margin-top: 0.5rem; overflow: hidden;">
              <div style="background: linear-gradient(90deg, var(--success-color), var(--warning-color)); height: 100%; width: ${candidato.indice_transparencia * 10}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${candidato.indice_transparencia}/10
              </div>
            </div>
          </div>
          
          <div class="propuesta-categoria" style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-light); border-radius: 0.5rem; border-left: 4px solid var(--primary-color);">
            <h4 id="categoria-titulo-${index}" style="color: var(--primary-color); margin-bottom: 0.5rem;"></h4>
            <p id="propuesta-${index}" style="color: var(--text-dark); line-height: 1.6;"></p>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Actualizar propuesta visible
    actualizarPropuestas();
}

// Actualizar propuestas mostradas según categoría
function actualizarPropuestas() {
    const categorias = {
        'economia': { nombre: '💼 Economía y Empleo', emoji: '💼' },
        'salud': { nombre: '🏥 Salud', emoji: '🏥' },
        'educacion': { nombre: '📚 Educación', emoji: '📚' },
        'seguridad': { nombre: '🛡️ Seguridad Ciudadana', emoji: '🛡️' },
        'corrupcion': { nombre: '⚖️ Lucha Anticorrupción', emoji: '⚖️' }
    };

    const categoriaInfo = categorias[categoriaActual];

    candidatosSeleccionados.forEach((candidato, index) => {
        if (candidato) {
            const titulo = document.getElementById(`categoria-titulo-${index}`);
            const propuesta = document.getElementById(`propuesta-${index}`);

            if (titulo && propuesta) {
                titulo.textContent = categoriaInfo.nombre;
                propuesta.textContent = candidato.propuestas[categoriaActual] || 'No disponible';
            }
        }
    });
}

// Cambiar categoría de propuestas
function cambiarCategoria(categoria) {
    categoriaActual = categoria;

    // Actualizar botones activos
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-categoria="${categoria}"]`).classList.add('active');
    // Actualizar propuestas
    actualizarPropuestas();
}

// Configurar eventos
function configurarEventos() {
    // Botones de categorías
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cambiarCategoria(btn.dataset.categoria);
        });
    });
}

// Mostrar error
function mostrarError(mensaje) {
    const contenedor = document.getElementById('comparacion-grid');
    contenedor.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: rgba(220, 20, 60, 0.1); border-radius: 0.5rem; border: 1px solid var(--accent-color);">
      <p style="color: var(--accent-color); font-weight: 600;">❌ ${mensaje}</p>
    </div>
  `;
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarComparador);
} else {
    iniciarComparador();
}
