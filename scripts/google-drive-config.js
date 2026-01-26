/**
 * Google Drive Configuration
 * Configuración para integración con Google Drive API
 */

const GOOGLE_DRIVE_CONFIG = {
    // IMPORTANTE: Configurar estas credenciales después de crear OAuth 2.0 Client ID
    CLIENT_ID: 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com',
    API_KEY: 'TU_API_KEY_AQUI',

    // Project ID de Google Cloud
    PROJECT_ID: 'base-de-datos-ii-e348b',

    // Scopes necesarios para Google Drive
    SCOPES: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly'
    ],

    // Discovery docs para Drive API
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],

    // Configuración de la carpeta raíz en Drive
    KNOWLEDGE_BASE_FOLDER_NAME: 'eligebien2026-knowledge-base',

    // Tipos de archivos soportados
    SUPPORTED_FILE_TYPES: {
        'application/json': 'json',
        'text/plain': 'text',
        'application/pdf': 'pdf',
        'application/vnd.google-apps.document': 'gdoc'
    },

    // Configuración de caché
    CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutos

    // Configuración de reintentos
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GOOGLE_DRIVE_CONFIG;
}
