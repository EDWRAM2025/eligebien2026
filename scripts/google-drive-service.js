/**
 * Google Drive Service
 * Servicio para interactuar con Google Drive API
 */

class GoogleDriveService {
    constructor() {
        this.isInitialized = false;
        this.isSignedIn = false;
        this.cache = new Map();
        this.knowledgeBaseFolderId = null;
    }

    /**
     * Inicializa el cliente de Google Drive
     */
    async init() {
        if (this.isInitialized) {
            return true;
        }

        try {
            console.log('🔄 Inicializando Google Drive API...');

            // Cargar la biblioteca de Google API
            await this.loadGoogleAPI();

            // Inicializar el cliente
            await gapi.client.init({
                apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
                clientId: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
                discoveryDocs: GOOGLE_DRIVE_CONFIG.DISCOVERY_DOCS,
                scope: GOOGLE_DRIVE_CONFIG.SCOPES.join(' ')
            });

            // Escuchar cambios en el estado de autenticación
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));

            // Verificar estado inicial
            this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            this.isInitialized = true;
            console.log('✅ Google Drive API inicializada');

            return true;
        } catch (error) {
            console.error('❌ Error inicializando Google Drive API:', error);
            return false;
        }
    }

    /**
     * Carga la biblioteca de Google API
     */
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                gapi.load('client:auth2', resolve);
            } else {
                reject(new Error('Google API no disponible'));
            }
        });
    }

    /**
     * Actualiza el estado de autenticación
     */
    updateSignInStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
        console.log(`🔐 Estado de autenticación: ${isSignedIn ? 'Conectado' : 'Desconectado'}`);
    }

    /**
     * Autentica al usuario con Google
     */
    async authenticate() {
        if (!this.isInitialized) {
            await this.init();
        }

        if (this.isSignedIn) {
            console.log('✅ Ya estás autenticado');
            return true;
        }

        try {
            console.log('🔐 Solicitando autenticación...');
            await gapi.auth2.getAuthInstance().signIn();
            return true;
        } catch (error) {
            console.error('❌ Error en autenticación:', error);
            return false;
        }
    }

    /**
     * Cierra la sesión del usuario
     */
    async signOut() {
        if (this.isSignedIn) {
            await gapi.auth2.getAuthInstance().signOut();
            console.log('👋 Sesión cerrada');
        }
    }

    /**
     * Obtiene o crea la carpeta de base de conocimiento
     */
    async getOrCreateKnowledgeBaseFolder() {
        if (this.knowledgeBaseFolderId) {
            return this.knowledgeBaseFolderId;
        }

        try {
            // Buscar carpeta existente
            const response = await gapi.client.drive.files.list({
                q: `name='${GOOGLE_DRIVE_CONFIG.KNOWLEDGE_BASE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
                spaces: 'drive'
            });

            if (response.result.files && response.result.files.length > 0) {
                this.knowledgeBaseFolderId = response.result.files[0].id;
                console.log('📁 Carpeta encontrada:', this.knowledgeBaseFolderId);
                return this.knowledgeBaseFolderId;
            }

            // Crear carpeta si no existe
            const createResponse = await gapi.client.drive.files.create({
                resource: {
                    name: GOOGLE_DRIVE_CONFIG.KNOWLEDGE_BASE_FOLDER_NAME,
                    mimeType: 'application/vnd.google-apps.folder'
                },
                fields: 'id'
            });

            this.knowledgeBaseFolderId = createResponse.result.id;
            console.log('✅ Carpeta creada:', this.knowledgeBaseFolderId);
            return this.knowledgeBaseFolderId;

        } catch (error) {
            console.error('❌ Error obteniendo/creando carpeta:', error);
            throw error;
        }
    }

    /**
     * Lista archivos de la carpeta de base de conocimiento
     */
    async listFiles() {
        if (!this.isSignedIn) {
            await this.authenticate();
        }

        try {
            const folderId = await this.getOrCreateKnowledgeBaseFolder();

            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, mimeType, modifiedTime, size)',
                orderBy: 'modifiedTime desc',
                pageSize: 100
            });

            console.log(`📄 ${response.result.files.length} archivos encontrados`);
            return response.result.files || [];
        } catch (error) {
            console.error('❌ Error listando archivos:', error);
            return [];
        }
    }

    /**
     * Lee el contenido de un archivo
     */
    async readFile(fileId, mimeType) {
        // Revisar caché
        const cacheKey = `file_${fileId}`;
        const cached = this.cache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < GOOGLE_DRIVE_CONFIG.CACHE_DURATION_MS) {
            console.log('📦 Usando caché para:', fileId);
            return cached.content;
        }

        try {
            let content;

            if (mimeType === 'application/vnd.google-apps.document') {
                // Exportar Google Docs como texto
                const response = await gapi.client.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });
                content = response.body;
            } else {
                // Leer archivo directamente
                const response = await gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                });
                content = response.body;
            }

            // Guardar en caché
            this.cache.set(cacheKey, {
                content: content,
                timestamp: Date.now()
            });

            return content;
        } catch (error) {
            console.error('❌ Error leyendo archivo:', error);
            throw error;
        }
    }

    /**
     * Busca en el contenido de todos los archivos
     */
    async searchInFiles(query) {
        const files = await this.listFiles();
        const results = [];

        for (const file of files) {
            try {
                const content = await this.readFile(file.id, file.mimeType);

                // Normalizar para búsqueda sin acentos
                const contentLower = content.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                const queryLower = query.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                if (contentLower.includes(queryLower)) {
                    // Extraer contexto alrededor de la coincidencia
                    const index = contentLower.indexOf(queryLower);
                    const start = Math.max(0, index - 100);
                    const end = Math.min(content.length, index + query.length + 100);

                    results.push({
                        fileName: file.name,
                        fileId: file.id,
                        context: content.substring(start, end),
                        fullContent: content
                    });
                }
            } catch (error) {
                console.warn(`⚠️ No se pudo leer archivo ${file.name}:`, error);
            }
        }

        return results;
    }

    /**
     * Sube un archivo a Drive
     */
    async uploadFile(fileName, content, mimeType = 'text/plain') {
        if (!this.isSignedIn) {
            await this.authenticate();
        }

        try {
            const folderId = await this.getOrCreateKnowledgeBaseFolder();

            const metadata = {
                name: fileName,
                mimeType: mimeType,
                parents: [folderId]
            };

            const response = await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                headers: {
                    'Content-Type': 'multipart/related'
                },
                body: JSON.stringify({
                    metadata: metadata,
                    content: content
                })
            });

            console.log('✅ Archivo subido:', response.result.id);
            return response.result;
        } catch (error) {
            console.error('❌ Error subiendo archivo:', error);
            throw error;
        }
    }

    /**
     * Limpia la caché
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Caché limpiada');
    }
}

// Instancia global del servicio
const googleDriveService = new GoogleDriveService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = googleDriveService;
}
