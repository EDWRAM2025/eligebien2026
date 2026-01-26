/**
 * Chatbot Cívico - Elige Bien 2026
 * Sistema de respuestas automáticas basado en FAQ
 */

let faqData = [];
let chatHistory = [];
let isOpen = false;

/**
 * Inicializa el chatbot
 */
async function initChatbot() {
    try {
        // Cargar FAQ
        const response = await fetch('./data/faq.json');
        faqData = await response.json();

        // Crear widget
        crearWidget();

        // Configurar event listeners
        configurarEventListeners();

        console.log('Chatbot Cívico inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar chatbot:', error);
    }
}

/**
 * Crea el widget del chatbot
 */
function crearWidget() {
    const widget = document.createElement('div');
    widget.id = 'chatbot-widget';
    widget.innerHTML = `
    <!-- Botón flotante -->
    <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Abrir asistente EDW ONPE">
      <span class="chat-icon">💬</span>
      <span class="chat-text">¿Preguntas?</span>
    </button>

    <!-- Ventana del chat -->
    <div class="chatbot-window" id="chatbot-window">
      <div class="chatbot-header">
        <div class="header-content">
          <img src="./EDWWWW.jpg" alt="EDW ONPE" class="bot-avatar">
          <div class="bot-info">
            <h3>EDW ONPE</h3>
            <p class="bot-status">En línea • Listo para ayudarte</p>
          </div>
        </div>
        <button class="close-chat" id="close-chat" aria-label="Cerrar chat">&times;</button>
      </div>

      <div class="chatbot-messages" id="chatbot-messages">
        <!-- Los mensajes se agregan aquí dinámicamente -->
      </div>

      <div class="chatbot-suggestions" id="chatbot-suggestions">
        <!-- Sugerencias de preguntas -->
      </div>

      <div class="chatbot-input-container">
        <input 
          type="text" 
          id="chatbot-input" 
          class="chatbot-input" 
          placeholder="Escribe tu pregunta..." 
          autocomplete="off"
        >
        <button class="send-button" id="send-button" aria-label="Enviar">
          ➤
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(widget);
}

/**
 * Configurar eventos
 */
function configurarEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-button');
    const input = document.getElementById('chatbot-input');

    // Verificar que todos los elementos existan antes de agregar listeners
    if (!toggle || !closeBtn || !sendBtn || !input) {
        console.warn('Algunos elementos del chatbot no se encontraron');
        return;
    }

    toggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', enviarMensaje);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    // Mostrar mensaje de bienvenida al abrir por primera vez
    mostrarMensajeBienvenida();
}

/**
 * Abre/cierra el chat
 */
function toggleChat() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');

    if (isOpen) {
        chatWindow.classList.add('active');
        toggle.classList.add('hidden');
        document.getElementById('chatbot-input').focus();
    } else {
        chatWindow.classList.remove('active');
        toggle.classList.remove('hidden');
    }
}

/**
 * Muestra mensaje de bienvenida
 */
function mostrarMensajeBienvenida() {
    const mensaje = {
        tipo: 'bot',
        texto: '¡Hola! 👋 Soy **EDW ONPE**, tu asistente personal para las Elecciones 2026. 🗳️\\n\\nEstoy aquí para ayudarte con:\\n• Información sobre el proceso electoral\\n• Datos de candidatos y propuestas\\n• Consultas sobre votación\\n• Y mucho más\\n\\n¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
    };

    agregarMensajeAlChat(mensaje);
    mostrarSugerencias();
}

/**
 * Envía mensaje del usuario
 */
function enviarMensaje() {
    const input = document.getElementById('chatbot-input');
    const texto = input.value.trim();

    if (texto === '') return;

    // Agregar mensaje del usuario
    const mensajeUsuario = {
        tipo: 'user',
        texto: texto,
        timestamp: new Date()
    };

    agregarMensajeAlChat(mensajeUsuario);
    chatHistory.push(mensajeUsuario);

    // Limpiar input
    input.value = '';

    // Buscar respuesta
    setTimeout(() => {
        const respuesta = buscarRespuesta(texto);
        agregarMensajeAlChat(respuesta);
        chatHistory.push(respuesta);
    }, 500);
}

/**
 * Busca respuesta en la FAQ
 */
function buscarRespuesta(pregunta) {
    const preguntaLower = pregunta.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Quitar acentos

    let mejorCoincidencia = null;
    let mejorScore = 0;

    // Buscar por keywords
    faqData.forEach(faq => {
        let score = 0;

        faq.keywords.forEach(keyword => {
            const keywordNormalized = keyword.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

            if (preguntaLower.includes(keywordNormalized)) {
                score += 2;
            }
        });

        // Bonus si coincide con la pregunta completa
        const preguntaFaqNormalized = faq.pregunta.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (preguntaLower.includes(preguntaFaqNormalized) || preguntaFaqNormalized.includes(preguntaLower)) {
            score += 5;
        }

        if (score > mejorScore) {
            mejorScore = score;
            mejorCoincidencia = faq;
        }
    });

    if (mejorScore >= 2) {
        return {
            tipo: 'bot',
            texto: mejorCoincidencia.respuesta,
            categoria: mejorCoincidencia.categoria,
            timestamp: new Date()
        };
    } else {
        return {
            tipo: 'bot',
            texto: 'Entiendo tu consulta, pero no encuentro una respuesta específica en mi base de datos actual. 🤔\\n\\nPermíteme ayudarte de otra manera:\\n\\n**Puedes:**\\n• Reformular tu pregunta con otras palabras\\n• Elegir una de las preguntas sugeridas abajo\\n• Consultar directamente:\\n  → ONPE: www.onpe.gob.pe\\n  → JNE: portal.jne.gob.pe\\n\\nEstoy aquí para ayudarte en lo que necesites. 😊',
            timestamp: new Date()
        };
    }
}

/**
 * Busca información en Google Drive
 */
async function buscarEnDrive(pregunta) {
    try {
        // Asegurarse de que Drive esté inicializado
        if (typeof googleDriveService === 'undefined') {
            return null;
        }

        if (!googleDriveService.isInitialized) {
            await googleDriveService.init();
        }

        // Si no está autenticado, no buscar (silencioso)
        if (!googleDriveService.isSignedIn) {
            return null;
        }

        // Buscar en archivos
        const resultados = await googleDriveService.searchInFiles(pregunta);

        if (resultados && resultados.length > 0) {
            // Tomar el primer resultado más relevante
            const mejorResultado = resultados[0];

            return {
                tipo: 'bot',
                texto: `✅ Encontré información relevante:\\n\\n${mejorResultado.context}\\n\\n📄 *Fuente: ${mejorResultado.fileName}*`,
                timestamp: new Date()
            };
        }

        return null;
    } catch (error) {
        console.error('❌ Error buscando en Drive:', error);
        return null;
    }
}

/**
 * Agrega mensaje al chat
 */
function agregarMensajeAlChat(mensaje) {
    const messagesContainer = document.getElementById('chatbot-messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${mensaje.tipo}-message`;

    const avatar = mensaje.tipo === 'bot'
        ? '<img src="./EDWWWW.jpg" alt="EDW ONPE" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">'
        : '👤';
    const tiempo = formatearTiempo(mensaje.timestamp);

    messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      ${mensaje.categoria ? `<span class="message-category">${mensaje.categoria}</span>` : ''}
      <div class="message-text">${formatearTexto(mensaje.texto)}</div>
      <div class="message-time">${tiempo}</div>
    </div>
  `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Muestra sugerencias de preguntas
 */
function mostrarSugerencias() {
    const suggestionsContainer = document.getElementById('chatbot-suggestions');

    // Mostrar 3 preguntas aleatorias
    const preguntasAleatorias = faqData
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    suggestionsContainer.innerHTML = '<div class="suggestions-title">Preguntas frecuentes:</div>';

    preguntasAleatorias.forEach(faq => {
        const suggestionBtn = document.createElement('button');
        suggestionBtn.className = 'suggestion-btn';
        suggestionBtn.textContent = faq.pregunta;
        suggestionBtn.onclick = () => {
            document.getElementById('chatbot-input').value = faq.pregunta;
            enviarMensaje();
            suggestionsContainer.innerHTML = '';
        };
        suggestionsContainer.appendChild(suggestionBtn);
    });
}

/**
 * Formatea el texto del mensaje
 */
function formatearTexto(texto) {
    // Convertir saltos de línea
    texto = texto.replace(/\\n/g, '<br>');

    // Convertir bullets
    texto = texto.replace(/• /g, '<br>• ');

    // Convertir negritas
    texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convertir links
    texto = texto.replace(/(www\.[^\s]+)/g, '<a href="https://$1" target="_blank">$1</a>');

    return texto;
}

/**
 * Formatea el tiempo
 */
function formatearTiempo(fecha) {
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${hora}:${minutos}`;
}

// Inicializar chatbot cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initChatbot);
