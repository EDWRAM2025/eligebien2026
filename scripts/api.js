/**
 * API - Capa de abstracción para acceso a datos
 */

// Cargar datos de candidatos
async function cargarCandidatos() {
    try {
        const response = await fetch('data/candidatos.json');
        if (!response.ok) throw new Error('Error al cargar candidatos');
        const data = await response.json();
        return data.candidatos;
    } catch (error) {
        console.error('Error cargando candidatos:', error);
        return [];
    }
}

// Cargar categorías de propuestas
async function cargarCategorias() {
    try {
        const response = await fetch('data/candidatos.json');
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        return data.categorias;
    } catch (error) {
        console.error('Error cargando categorías:', error);
        return [];
    }
}

// Obtener candidato por ID
async function obtenerCandidato(id) {
    const candidatos = await cargarCandidatos();
    return candidatos.find(c => c.id === id);
}

// Comparar candidatos por IDs
async function compararCandidatos(ids) {
    const candidatos = await cargarCandidatos();
    return candidatos.filter(c => ids.includes(c.id));
}

// Buscar candidatos por nombre o partido
async function buscarCandidatos(termino) {
    const candidatos = await cargarCandidatos();
    const terminoLower = termino.toLowerCase();
    return candidatos.filter(c =>
        c.nombre.toLowerCase().includes(terminoLower) ||
        c.partido.toLowerCase().includes(terminoLower) ||
        c.siglas.toLowerCase().includes(terminoLower)
    );
}

// Cargar verificaciones (fact-checking)
async function cargarVerificaciones() {
    try {
        const response = await fetch('data/verificaciones.json');
        if (!response.ok) {
            // Si no existe el archivo aún, retornar array vacío
            console.warn('Archivo de verificaciones no encontrado');
            return [];
        }
        const data = await response.json();
        return data.verificaciones;
    } catch (error) {
        console.error('Error cargando verificaciones:', error);
        return [];
    }
}
