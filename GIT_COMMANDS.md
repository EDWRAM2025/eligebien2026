# Comandos Git para Subir Cambios

## Paso 1: Ver el estado actual

```bash
git status
```

## Paso 2: Agregar todos los archivos modificados

```bash
git add .
```

## Paso 3: Crear commit con mensaje descriptivo

```bash
git commit -m "feat: Integración Google Drive + Chatbot EDW ONPE

- Agregado servicio de Google Drive con OAuth 2.0 para base de conocimiento extendida
- Renombrado chatbot de 'Asistente Cívico' a 'EDW ONPE'
- Cambiado avatar del chatbot de emoji a imagen personalizada EDWWWW.jpg
- Mejorada personalidad del chatbot con mensajes más amigables y profesionales
- Implementada búsqueda inteligente en documentos de Google Drive
- Agregada guía de configuración paso a paso (GOOGLE_DRIVE_SETUP.md)
- Actualizado README con nuevas funcionalidades

Nuevos archivos:
- scripts/google-drive-config.js - Configuración de credenciales
- scripts/google-drive-service.js - Servicio de integración con Drive
- GOOGLE_DRIVE_SETUP.md - Guía de configuración

Archivos modificados:
- scripts/chatbot.js - Rebranding y búsqueda en Drive
- index.html - Scripts de Google API
- styles.css - Soporte para avatar de imagen"
```

## Paso 4: Subir cambios a GitHub

```bash
git push origin main
```

Si tu rama principal se llama "master" en lugar de "main", usa:

```bash
git push origin master
```

## Comandos Completos (Copiar y Pegar)

```bash
cd c:\Users\jesuk\OneDrive\Escritorio\eligebien2026
git add .
git commit -m "feat: Integración Google Drive + Chatbot EDW ONPE

- Agregado servicio de Google Drive con OAuth 2.0 para base de conocimiento extendida
- Renombrado chatbot de 'Asistente Cívico' a 'EDW ONPE'
- Cambiado avatar del chatbot de emoji a imagen personalizada EDWWWW.jpg
- Mejorada personalidad del chatbot con mensajes más amigables y profesionales
- Implementada búsqueda inteligente en documentos de Google Drive
- Agregada guía de configuración paso a paso (GOOGLE_DRIVE_SETUP.md)

Nuevos archivos:
- scripts/google-drive-config.js - Configuración de credenciales
- scripts/google-drive-service.js - Servicio de integración con Drive
- GOOGLE_DRIVE_SETUP.md - Guía de configuración

Archivos modificados:
- scripts/chatbot.js - Rebranding y búsqueda en Drive
- index.html - Scripts de Google API
- styles.css - Soporte para avatar de imagen"

git push origin main
```

## Verificar en GitHub

Después de hacer push, visita:
<https://github.com/EDWRAM2025/eligebien2026>

Y verifica que:

1. Todos los archivos nuevos aparezcan
2. Los archivos modificados muestren los cambios
3. El commit tiene el mensaje correcto
