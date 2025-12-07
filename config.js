const CONFIG = {
    // Información de la App
    APP_NAME: 'Elige Bien 2026',
    APP_DESCRIPTION: 'Plataforma cívica con información verificada sobre las Elecciones Generales 2026',
    VERSION: '1.0.0',

    // Paths de Assets
    LOGO: {
        HEADER: 'assets/images/LOGO.png',
        MOBILE: 'assets/images/LOGO.png',
        FOOTER: 'assets/images/LOGO.png',
        ICON: 'assets/images/LOGO.png',
        WHITE: 'assets/images/LOGO.png',
        ORIGINAL: 'assets/images/LOGO.png'
    },

    // API Endpoints
    API_ENDPOINTS: {
        ONPE_DATA: 'https://eg2026.onpe.gob.pe/',
    },

    // OpenAI Configuration
    OPENAI: {
        API_KEY: '', // IMPORTANTE: Configurar con variable de entorno o prompt al usuario
        MODEL: 'gpt-4-turbo-preview', // o 'gpt-3.5-turbo'
        MAX_TOKENS: 500,
        TEMPERATURE: 0.7
    },

    // PWA Configuration
    PWA: {
        ENABLED: true,
        THEME_COLOR: '#0052A3',
        BACKGROUND_COLOR: '#FFFFFF'
    },

    // Features
    ANALYTICS_ENABLED: true,
    CHATBOT_ENABLED: true,
    OFFLINE_MODE: true,

    // Fecha de las elecciones
    ELECTION_DATE: '2026-04-12T07:00:00-05:00'
};
