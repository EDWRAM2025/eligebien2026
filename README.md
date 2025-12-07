# Elige Bien 2026

**Plataforma cívica con información verificada y transparente sobre las Elecciones Generales 2026 de Perú**

![Logo Elige Bien 2026](assets/images/LOGO.png)

## 📋 Descripción

Elige Bien 2026 es una plataforma web moderna y responsive diseñada para empoderar a los ciudadanos peruanos con información verificada, transparente y accesible sobre las Elecciones Generales 2026. La plataforma proporciona herramientas interactivas para comparar candidatos, verificar declaraciones, y acceder a recursos educativos oficiales.

## ✨ Funcionalidades Principales

### ⏰ Contador Regresivo
- Cuenta regresiva en tiempo real hasta las elecciones (12 de abril de 2026, 7:00 AM)
- Actualización automática cada segundo
- Visualización de días, horas, minutos y segundos

### 📊 Herramientas Cívicas (En Desarrollo)
- **Comparador de Candidatos**: Comparación lado a lado de propuestas y antecedentes
- **Fact-Checking**: Verificación de declaraciones con fuentes confiables
- **Mapa de Transparencia**: Indicadores de transparencia por región
- **Chatbot Cívico**: Asistente IA para consultas electorales (OpenAI)

### 📺 Contenido Multimedia
- Videos educativos embebidos de fuentes oficiales (ONPE)
- Enlaces a redes sociales oficiales (YouTube, Facebook, Instagram, Twitter/X)

### 🔗 Enlaces Útiles
- Organismos oficiales: ONPE, JNE, RENIEC
- Verificadores: OjoPúblico, Convoca, IDL-Reporteros
- Información electoral y recursos educativos

### 📱 PWA (Progressive Web App)
- Instalable en dispositivos móviles y escritorio
- Funcionalidad offline
- Experiencia de aplicación nativa

## 🚀 Cómo Usar

### Ejecución Local

1. **Abrir directamente en navegador**:
   ```
   Haz doble clic en index.html
   ```
   O navega a: `file:///ruta/completa/eligebien2026/index.html`

2. **Usando un servidor local** (recomendado para PWA):
   
   **Opción 1 - Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Luego abre: http://localhost:8000
   ```
   
   **Opción 2 - Node.js (http-server):**
   ```bash
   npx http-server -p 8000
   
   # Luego abre: http://localhost:8000
   ```
   
   **Opción 3 - PHP:**
   ```bash
   php -S localhost:8000
   
   # Luego abre: http://localhost:8000
   ```

3. **Instalación como PWA**:
   - Abre la aplicación en Chrome/Edge
   - Haz clic en el icono de instalación en la barra de direcciones
   - Confirma la instalación
   - La app se abrirá en una ventana independiente

## 📂 Estructura del Proyecto

```
eligebien2026/
├── index.html              # Página principal
├── styles.css              # Estilos con diseño ONPE
├── config.js               # Configuración global
├── manifest.json           # Manifiesto PWA
├── service-worker.js       # Service Worker para offline
├── assets/
│   ├── images/
│   │   └── LOGO.png       # Logo principal
│   └── icons/             # Iconos (vacío por ahora)
├── scripts/
│   ├── countdown.js       # Contador regresivo
│   └── utils.js           # Utilidades del logo oficial
├── data/                  # Datos JSON (próximamente)
└── README.md              # Este archivo
```

## 🎨 Diseño

La plataforma sigue el diseño visual de [ONPE 2026](https://eg2026.onpe.gob.pe/):

- **Colores principales**:
  - Azul institucional: `#0052A3`
  - Azul oscuro: `#003D82`
  - Rojo acento: `#DC143C`
  
- **Características**:
  - Layout limpio y moderno
  - Diseño responsivemobile-first
  - Navegación sticky
  - Animaciones suaves

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox
- **JavaScript**: ES6+, Service Workers
- **PWA**: Manifest, Service Worker, Cache API

## 📅 Información Electoral

**Fecha de las Elecciones**: Domingo 12 de Abril de 2026, 7:00 AM - 5:00 PM

**Qué elegiremos**:
- Presidente y Vicepresidentes
- 60 Senadores
- 130 Diputados
- Representantes al Parlamento Andino

## 🔗 Enlaces Oficiales

- [ONPE](https://www.onpe.gob.pe/) - Oficina Nacional de Procesos Electorales
- [JNE](https://www.jne.gob.pe/) - Jurado Nacional de Elecciones
- [RENIEC](https://www.reniec.gob.pe/) - Registro Nacional de Identificación
- [Portal EG2026](https://eg2026.onpe.gob.pe/) - Información oficial del proceso

## 🛠️ Próximos Pasos

- [ ] Implementar comparador de candidatos
- [ ] Desarrollar módulo de fact-checking
- [ ] Crear mapa interactivo de transparencia
- [ ] Integrar chatbot con OpenAI API
- [ ] Agregar dashboard de analíticas
- [ ] Crear base de datos de candidatos
- [ ] Optimizar logo en diferentes tamaños
- [ ] Agregar más videos educativos

## 📄 Licencia

Plataforma cívica independiente para información electoral verificada.

## 📞 Contacto

Para información electoral oficial:
- **ONPE**: (01) 417-0630
- **WhatsApp ONPE**: +51 995 404 991
- **Email ONPE**: informes@onpe.gob.pe

---

**© 2025 Elige Bien 2026** - Información verificada para decisiones informadas
