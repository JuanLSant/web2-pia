import { useState, useEffect, useRef } from 'react';
import '../styles/ayuda.css';

const faqsData = [
    {
        id: 1,
        category: 'reservas',
        icon: '🎟️',
        question: '¿Cuánto tiempo tengo para completar la compra de mis asientos?',
        answer: 'Una vez que seleccionas tus asientos en el mapa, el sistema los reserva exclusivamente para ti durante 5 minutos (lo verás marcado como temporalmente bloqueado). Si no completas la compra dentro de este tiempo, el sistema liberará los asientos automáticamente para que otros usuarios puedan adquirirlos.'
    },
    {
        id: 2,
        category: 'boletos',
        icon: '🏟️',
        question: '¿Cómo puedo entender la nomenclatura e información de mi boleto?',
        answer: 'Cada boleto tiene tres identificadores de ubicación: Zona (la categoría de precio y tribuna general, como Zona 1, 2, 3 o Palcos), Área (la sección específica de la tribuna, ej: C-26) y Asientos (la coordenada exacta de fila y columna asignada a tu asiento, ej: 0-2).'
    },
    {
        id: 3,
        category: 'boletos',
        icon: '📱',
        question: '¿Cómo accedo a mis boletos comprados y al código QR?',
        answer: 'Todos tus boletos adquiridos se guardan digitalmente y de forma segura en tu cuenta. Para verlos, ve a "Mi perfil" -> "Mis Boletos". Cada boleto incluye un código QR único que deberás mostrar desde tu celular en los accesos del estadio.'
    },
    {
        id: 4,
        category: 'pagos',
        icon: '💳',
        question: '¿Cómo funciona el Monedero Digital (Wallet) para comprar?',
        answer: 'Tu monedero virtual (Wallet) te permite almacenar saldo de forma segura para compras rápidas. Puedes recargar saldo utilizando tus métodos de pago preferidos y, al momento de comprar boletos, el total se descontará directamente de tu saldo disponible en la Wallet.'
    },
    {
        id: 5,
        category: 'cuenta',
        icon: '👤',
        question: '¿Cómo puedo cambiar mi foto de perfil o actualizar mis datos?',
        answer: 'Desde tu perfil de usuario puedes editar tu nombre, cambiar tu contraseña y cargar una foto. Simplemente haz clic sobre el círculo de tu imagen actual para seleccionar una nueva foto de perfil y guardarla.'
    },
    {
        id: 6,
        category: 'pagos',
        icon: '🔄',
        question: '¿Puedo cancelar o solicitar un reembolso de mis boletos?',
        answer: 'Una vez que un boleto pasa a estado "comprado", no se permiten cancelaciones ni devoluciones. Te recomendamos verificar minuciosamente la ubicación del asiento, la fecha y la hora del partido antes de concretar la transacción.'
    }
];

const categories = [
    { id: 'all', name: 'Todos', icon: '🔍' },
    { id: 'reservas', name: 'Reservas', icon: '🎟️' },
    { id: 'boletos', name: 'Boletos y QR', icon: '🏟️' },
    { id: 'pagos', name: 'Pagos y Wallet', icon: '💳' },
    { id: 'cuenta', name: 'Mi Cuenta', icon: '👤' }
];

const ChevronIcon = () => (
    <svg className="faq-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const SearchIcon = () => (
    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

function Ayuda({ user, setUser, setPage }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeFaqId, setActiveFaqId] = useState(null);

    // Estados del Chatbot
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'init',
            sender: 'bot',
            text: '¡Hola! Soy tu asistente inteligente del Mundial 2026. Puedo resolver tus dudas sobre el proceso de compra de boletos o buscar en internet información sobre partidos, equipos y fechas. ¿En qué te puedo ayudar hoy?'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Efecto para scroll automático al final de los mensajes del chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, chatOpen]);

    const handleCerrarSesion = () => {
        setUser(null);
        setDropdownOpen(false);
    };

    const toggleFaq = (id) => {
        setActiveFaqId(activeFaqId === id ? null : id);
    };

    const handleSendChatMessage = async (e) => {
        if (e) e.preventDefault();
        if (!chatInput.trim() || isTyping) return;

        const userMessageText = chatInput.trim();
        setChatInput('');

        // Agregar mensaje de usuario
        const newUserMessage = {
            id: Date.now() + '-user',
            sender: 'user',
            text: userMessageText
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:8081/ayuda/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessageText,
                    history: messages.slice(1) // Omitir el primer mensaje de bienvenida de la IA
                })
            });

            if (!response.ok) throw new Error("Error al consultar el chat de ayuda");

            const data = await response.json();

            const newBotMessage = {
                id: Date.now() + '-bot',
                sender: 'bot',
                text: data.reply
            };
            setMessages(prev => [...prev, newBotMessage]);

        } catch (err) {
            console.error("Error al enviar mensaje al chat:", err);
            setMessages(prev => [...prev, {
                id: Date.now() + '-error',
                sender: 'bot',
                text: "Lo siento, ocurrió un error de conexión con la IA. Asegúrate de que el servidor esté activo y reintenta."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Filtrar FAQs por buscador y categoría
    const filteredFaqs = faqsData.filter((faq) => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryCount = (catId) => {
        if (catId === 'all') return faqsData.length;
        return faqsData.filter(faq => faq.category === catId).length;
    };

    return (
        <div className="background-page">
            <footer className='bar-menu'>
                <div className="bar-space"></div>
                <div className="bar-boton-section">
                    <button className='button-menu-2' onClick={() => setPage('inicio')}>Inicio</button>
                </div>
                <div className="bar-boton-section">
                    <button className='button-menu-2' onClick={() => setPage('perfil')}>Mi perfil</button>
                </div>
                <div className="bar-boton-section">
                    {user ? (
                        <div className="avatar-wrapper" ref={dropdownRef}>
                            <div
                                className="avatar-menu"
                                title={user.nombre}
                                onClick={() => setDropdownOpen(prev => !prev)}
                            >
                                {user.imagen_url ? (
                                    <img src={`http://localhost:8081/${user.imagen_url}`} alt="Avatar" />
                                ) : (
                                    user.nombre.charAt(0).toUpperCase()
                                )}
                            </div>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" onClick={() => { setPage('wallet'); setDropdownOpen(false); }}>
                                        Wallet
                                    </button>
                                    <button className="dropdown-item" onClick={() => { setPage('ayuda'); setDropdownOpen(false); }}>
                                        Ayuda
                                    </button>
                                    <button className="dropdown-item danger" onClick={handleCerrarSesion}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className='button-menu' onClick={() => setPage('login')}>Iniciar sesión</button>
                    )}
                </div>
            </footer>

            <div className="container-content-dashboard">
                <div className="ayuda-container">
                    
                    {/* Encabezado */}
                    <div className="ayuda-header">
                        <h1>Centro de Ayuda</h1>
                        <p>¿Tienes dudas sobre el proceso de compra de boletos para el Mundial 2026? Explora nuestros temas de ayuda o utiliza el buscador para resolver tus preguntas rápidamente.</p>
                    </div>

                    {/* Buscador */}
                    <div className="search-wrapper">
                        <div className="search-bar-container">
                            <SearchIcon />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Escribe tu duda (ej: reserva, QR, costo)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Limpiar búsqueda">
                                    <CloseIcon />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tarjetas de Categoría */}
                    <div className="categories-grid">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    setActiveFaqId(null); // Cerrar cualquier acordeón abierto al cambiar categoría
                                }}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <div className="category-info">
                                    <h3>{cat.name}</h3>
                                    <span>{getCategoryCount(cat.id)} {getCategoryCount(cat.id) === 1 ? 'pregunta' : 'preguntas'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Listado de FAQs */}
                    <div className="faqs-section">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`faq-item ${activeFaqId === faq.id ? 'active' : ''}`}
                                >
                                    <button
                                        className="faq-question-btn"
                                        onClick={() => toggleFaq(faq.id)}
                                    >
                                        <div className="faq-title-wrapper">
                                            <span className="faq-question-icon">{faq.icon}</span>
                                            <h3>{faq.question}</h3>
                                        </div>
                                        <ChevronIcon />
                                    </button>
                                    
                                    <div className="faq-answer-wrapper">
                                        <div className="faq-answer-content">
                                            <p className="faq-answer-text">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results-card">
                                <span className="no-results-icon">🔍</span>
                                <h3>No encontramos resultados</h3>
                                <p>Prueba buscando con palabras clave diferentes o selecciona otra categoría.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Botón Flotante del Chatbot */}
            <button className={`chat-toggle-btn ${chatOpen ? 'open' : ''}`} onClick={() => setChatOpen(!chatOpen)} title="Pregunta a la IA">
                {chatOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>

            {/* Ventana del Chatbot */}
            {chatOpen && (
                <div className="chat-window">
                    <div className="chat-window-header">
                        <div className="chat-bot-avatar">🤖</div>
                        <div className="chat-bot-title-info">
                            <h4>Asistente Virtual</h4>
                            <span>Google Search Grounding activo</span>
                        </div>
                    </div>
                    <div className="chat-window-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-message-bubble bot typing">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-window-input-area" onSubmit={handleSendChatMessage}>
                        <input
                            type="text"
                            placeholder="Pregunta sobre partidos, boletos, fechas..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={!chatInput.trim() || isTyping} title="Enviar mensaje">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Ayuda;