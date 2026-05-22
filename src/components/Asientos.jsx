import { useState, useEffect, useRef } from 'react';

const costosZona = {
    'zona-1': 5000,
    'zona-2': 3500,
    'zona-3': 2000,
    'palcos': 10000
};

function Asientos({ user, setUser, setPage, selectedMatch }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ── Estados de SeleccionAsientos ──────────────────────────────
    const [selectedSeat] = useState(() => {
        const saved = localStorage.getItem('selectedSeat');
        return saved ? JSON.parse(saved) : { id: 'A-1', zona: 'zona-1' };
    });

    const [mapa] = useState([
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
    ]);
    const [seleccionados, setSeleccionados] = useState([]);
    const precio = costosZona[selectedSeat.zona] || 5000;

    // ── Estados y Efectos del Temporizador de 5 Minutos ───────────
    const [tiempoRestante, setTiempoRestante] = useState(300); // 5 minutos en segundos
    const [temporizadorActivo, setTemporizadorActivo] = useState(false);

    useEffect(() => {
        let intervalo = null;
        if (temporizadorActivo && tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante(prev => prev - 1);
            }, 1000);
        } else if (tiempoRestante === 0) {
            alert("¡El tiempo de reserva ha expirado! Tu selección de asientos ha sido liberada.");
            setSeleccionados([]);
            setTemporizadorActivo(false);
            setTiempoRestante(300);
        }
        return () => clearInterval(intervalo);
    }, [temporizadorActivo, tiempoRestante]);

    useEffect(() => {
        if (seleccionados.length === 0 && temporizadorActivo) {
            setTemporizadorActivo(false);
            setTiempoRestante(300);
        }
    }, [seleccionados, temporizadorActivo]);

    const formatearTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const restoSegundos = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${restoSegundos.toString().padStart(2, '0')}`;
    };

    const handleConfirmarAsientos = () => {
        setTemporizadorActivo(true);
        setTiempoRestante(300);
    };

    const handleCancelarReserva = () => {
        setSeleccionados([]);
        setTemporizadorActivo(false);
        setTiempoRestante(300);
    };

    const handleFinalizarCompra = () => {
        alert(`¡Asientos confirmados con éxito! Total a pagar: $${seleccionados.length * precio}`);
        setSeleccionados([]);
        setTemporizadorActivo(false);
        setTiempoRestante(300);
        setPage('inicio');
    };
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCerrarSesion = () => {
        setUser(null);
        setDropdownOpen(false);
    };

    const manejarCambio = (fila, col) => {
        const id = `${fila}-${col}`;
        setSeleccionados(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
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
                <div className="container-dashboard-col">
                    <div className="container-banner-ini-p"></div>

                    {/* ── Contenido de SeleccionAsientos ── */}
                    <header className="header-estadio">
                        <h1>{selectedMatch?.titulo || "Mundial 2026"}</h1>
                        <p>Mundial FIFA 2026</p>
                    </header>

                    <main className="layout-principal">
                        <section className="contenedor-asientos">
                            <div className="cancha-linea">CANCHA</div>
                            <div className="grid-estadio">
                                {mapa.map((fila, i) => (
                                    <div key={i} className="fila-asientos">
                                        {fila.map((estado, j) => {
                                            const id = `${i}-${j}`;
                                            const estaOcupado = estado === 'O';
                                            return (
                                                <label key={id} className="asiento-label">
                                                    <input
                                                        type="checkbox"
                                                        disabled={estaOcupado || temporizadorActivo}
                                                        checked={seleccionados.includes(id)}
                                                        onChange={() => manejarCambio(i, j)}
                                                        className="input-asiento-oculto"
                                                    />
                                                    <span className={`asiento-visual ${estaOcupado ? 'asiento-ocupado' : ''} ${temporizadorActivo ? 'asientos-bloqueados' : ''}`} />
                                                </label>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="columna-derecha">
                            <div className={`temporizador-card ${temporizadorActivo ? 'activo' : ''}`}>
                                <div className="temporizador-titulo">
                                    {temporizadorActivo ? "Tiempo de Reserva Activo" : "Tiempo de Reserva (Inactivo)"}
                                </div>
                                <div className={`temporizador-reloj ${!temporizadorActivo ? 'inactivo' : ''}`}>
                                    {formatearTiempo(tiempoRestante)}
                                </div>
                                <div className="temporizador-barra">
                                    <div 
                                        className="temporizador-progreso" 
                                        style={{ 
                                            width: `${(tiempoRestante / 300) * 100}%`,
                                            backgroundColor: temporizadorActivo ? '#e74c3c' : '#4b5563'
                                        }}
                                    />
                                </div>
                            </div>

                            <aside className="panel-pago">
                                <h3>Resumen de Compra</h3>
                                <div className="detalle">
                                    <p>
                                        <span style={{ textTransform: 'capitalize' }}>
                                            {selectedSeat.zona.replace('-', ' ')}
                                        </span>
                                        {` - Area: ${selectedSeat.id} - Estadio BBVA`}
                                    </p>
                                    <p>Asientos: {seleccionados.length}</p>
                                    {seleccionados.map(id => (
                                        <div key={id} className="ticket-item">
                                            <span>Asiento {id}</span>
                                            <span>${precio}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="total-pago">
                                    <span>Total:</span>
                                    <span>${seleccionados.length * precio}</span>
                                </div>
                                {temporizadorActivo ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                        <button 
                                            className="btn-finalizar" 
                                            onClick={handleFinalizarCompra}
                                        >
                                            Finalizar compra
                                        </button>
                                        <button 
                                            className="btn-cancelar" 
                                            onClick={handleCancelarReserva}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="btn-siguiente" 
                                        disabled={seleccionados.length === 0}
                                        onClick={handleConfirmarAsientos}
                                    >
                                        Confirmar asientos
                                    </button>
                                )}
                            </aside>
                        </div>
                    </main>
                    {/* ─────────────────────────────────── */}

                </div>
            </div>
        </div>
    );
}

export default Asientos;