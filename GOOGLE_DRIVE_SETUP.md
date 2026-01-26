# Configuración de Google Drive API - Guía Completa

Este documento te guiará paso a paso para configurar Google Drive API con tu proyecto.

## Paso 1: Acceder a Google Cloud Console

Ya tienes tu proyecto creado en: <https://console.cloud.google.com/welcome?project=base-de-datos-ii-e348b>

## Paso 2: Habilitar Google Drive API

1. Ve a **APIs & Services** > **Library**
   - URL directa: <https://console.cloud.google.com/apis/library?project=base-de-datos-ii-e348b>

2. Busca "Google Drive API"

3. Haz clic en "Google Drive API"

4. Clic en el botón **"ENABLE"** (Habilitar)

## Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** > **Credentials**
   - URL directa: <https://console.cloud.google.com/apis/credentials?project=base-de-datos-ii-e348b>

2. Clic en **"+ CREATE CREDENTIALS"** (Crear credenciales)

3. Selecciona **"OAuth client ID"**

4. Si te pide configurar la pantalla de consentimiento:
   - Clic en **"CONFIGURE CONSENT SCREEN"**
   - Selecciona **"External"**
   - Completa la información básica:
     - App name: **Elige Bien 2026**
     - User support email: **tu email**
     - Developer contact: **tu email**
   - Clic en **"SAVE AND CONTINUE"**  
   - En Scopes, clic en **"SAVE AND CONTINUE"**
   - En Test users, agrega tu email
   - Clic en **"SAVE AND CONTINUE"**

5. Ahora crea las credenciales:
   - Application type: **Web application**
   - Name: **EDW ONPE Chatbot**
   - Authorized JavaScript origins:

     ```
     http://localhost:8000
     http://127.0.0.1:8000
     ```

   - Authorized redirect URIs:

     ```
     http://localhost:8000
     http://127.0.0.1:8000
     ```

6. Clic en **"CREATE"**

7. **¡IMPORTANTE!** Copia tu **Client ID** (aparecerá como: `xxxxxxxxx-xxxxxxxx.apps.googleusercontent.com`)

## Paso 4: Crear API Key

1. En la misma página de Credentials, clic en **"+ CREATE CREDENTIALS"**

2. Selecciona **"API key"**

3. **¡IMPORTANTE!** Copia tu **API Key** inmediatamente

4. (Opcional pero recomendado) Clic en "Restrict Key":
   - En "API restrictions", selecciona **"Restrict key"**
   - Marca únicamente **"Google Drive API"**
   - Clic en **"SAVE"**

## Paso 5: Configurar las Credenciales en el Código

Abre el archivo: `scripts/google-drive-config.js`

Reemplaza estas líneas:

```javascript
CLIENT_ID: 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com',
API_KEY: 'TU_API_KEY_AQUI',
```

Con tus credenciales reales (las que copiaste en los pasos 3 y 4):

```javascript
CLIENT_ID: 'tu-client-id-real.apps.googleusercontent.com',
API_KEY: 'tu-api-key-real',
```

## Paso 6: Probar la Integración

1. Inicia un servidor local:

   ```bash
   # Opción 1: Python
   python -m http.server 8000
   
   # Opción 2: usar el archivo start-server.bat incluido
   ```

2. Abre <http://localhost:8000> en tu navegador

3. Abre el chatbot haciendo clic en el botón "¿Preguntas?"

4. El chatbot (EDW ONPE) debería funcionar normalmente con la FAQ local

5. Para probar Google Drive:
   - Abre la consola del navegador (F12)
   - Ejecuta: `await googleDriveService.authenticate()`
   - Se abrirá una ventana de Google para autorizar el acceso
   - Autoriza con tu cuenta de Google
   - ¡Listo! Ahora el chatbot puede buscar en Google Drive

## Paso 7: Crear la Carpeta de Base de Conocimiento

El servicio creará automáticamente una carpeta llamada `eligebien2026-knowledge-base` en tu Google Drive.

Puedes agregar archivos de texto (.txt), JSON (.json), o Google Docs con información adicional que quieras que el chatbot use para responder preguntas.

## Estructura Recomendada de Archivos en Drive

```
eligebien2026-knowledge-base/
├── faq-ampliada.txt
├── candidatos-info.txt
├── proceso-electoral-detallado.txt
└── preguntas-frecuentes-extra.json
```

## Notas Importantes

- Las credenciales OAuth 2.0 funcionan solo en `http://localhost:8000` o `http://127.0.0.1:8000`
- Si quieres usar en producción (GitHub Pages), necesitarás agregar la URL de producción a "Authorized JavaScript origins"
- El chatbot funciona perfectamente sin Google Drive (usa solo la FAQ local)
- Google Drive es una función adicional para expandir la base de conocimiento sin modificar código

## Solución de Problemas

**Error: "Redirect URI mismatch"**

- Verifica que estés usando exactamente `http://localhost:8000`
- Asegúrate de haber agregado esta URL en las credenciales de Google Cloud

**El chatbot no muestra el botón de Google Drive**

- Es normal, el chatbot busca automáticamente en Drive cuando no encuentra respuesta en la FAQ local

**"Access blocked: This app's request is invalid"**

- Asegúrate de haber configurado la pantalla de consentimiento
- Agrega tu email en la lista de "Test users"
