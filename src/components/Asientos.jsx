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
    const [asientosDb, setAsientosDb] = useState([]);
    const [loading, setLoading] = useState(true);
    const precio = costosZona[selectedSeat.zona] || 5000;

    // ── Estados y Efectos del Temporizador de 5 Minutos ───────────
    const [tiempoRestante, setTiempoRestante] = useState(300); // 5 minutos en segundos
    const [temporizadorActivo, setTemporizadorActivo] = useState(false);

    const fetchAsientos = async () => {
        if (!selectedMatch?.id_partido) return;
        try {
            const url = `http://localhost:8081/partido-asientos?id_partido=${selectedMatch.id_partido}&zona=${selectedSeat.zona}&area=${selectedSeat.id}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setAsientosDb(data.asientos);
            }
        } catch (err) {
            console.error("Error al obtener los asientos de la BD:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAsientos();

        // Configurar un intervalo para refrescar los asientos constantemente cada 5 segundos
        const intervalo = setInterval(() => {
            fetchAsientos();
        }, 5000);

        return () => clearInterval(intervalo);
    }, [selectedMatch, selectedSeat]);

    // Remover de la selección local los asientos que hayan sido reservados/comprados por otros usuarios
    useEffect(() => {
        if (!temporizadorActivo && asientosDb.length > 0) {
            setSeleccionados(prev => {
                if (prev.length === 0) return prev;
                const nuevosSeleccionados = prev.filter(id => {
                    const seatDb = asientosDb.find(a => a.nomenclatura === id);
                    return seatDb && seatDb.estado === 'activo';
                });
                if (nuevosSeleccionados.length !== prev.length) {
                    return nuevosSeleccionados;
                }
                return prev;
            });
        }
    }, [asientosDb, temporizadorActivo]);

    const handleCancelarReserva = async (asientosALiberar = seleccionados) => {
        if (asientosALiberar.length === 0) return;
        try {
            const response = await fetch('http://localhost:8081/liberar-asientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_partido: selectedMatch.id_partido,
                    zona: selectedSeat.zona,
                    area: selectedSeat.id,
                    nomenclaturas: asientosALiberar
                })
            });
            if (response.ok) {
                setSeleccionados([]);
                setTemporizadorActivo(false);
                setTiempoRestante(300);
                await fetchAsientos();
            } else {
                console.error("No se pudieron liberar los asientos en la base de datos.");
            }
        } catch (err) {
            console.error("Error al liberar asientos:", err);
        }
    };

    useEffect(() => {
        let intervalo = null;
        if (temporizadorActivo && tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante(prev => prev - 1);
            }, 1000);
        } else if (tiempoRestante === 0 && temporizadorActivo) {
            const guardados = [...seleccionados];
            alert("¡El tiempo de reserva ha expirado! Tu selección de asientos ha sido liberada.");
            handleCancelarReserva(guardados);
        }
        return () => clearInterval(intervalo);
    }, [temporizadorActivo, tiempoRestante, seleccionados]);

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

    const handleConfirmarAsientos = async () => {
        if (seleccionados.length === 0) return;
        try {
            const response = await fetch('http://localhost:8081/reservar-asientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_partido: selectedMatch.id_partido,
                    zona: selectedSeat.zona,
                    area: selectedSeat.id,
                    nomenclaturas: seleccionados
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setTemporizadorActivo(true);
                setTiempoRestante(300);
                await fetchAsientos();
            } else {
                alert(data.error || "No se pudieron reservar los asientos. Intenta de nuevo.");
                setSeleccionados([]);
                await fetchAsientos();
            }
        } catch (err) {
            console.error("Error al reservar asientos:", err);
            alert("Error al conectar con el servidor. Intenta de nuevo.");
        }
    };

    const handleFinalizarCompra = async () => {
        if (seleccionados.length === 0) return;
        try {
            const totalCompra = seleccionados.length * precio;
            const response = await fetch('http://localhost:8081/comprar-asientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_partido: selectedMatch.id_partido,
                    zona: selectedSeat.zona,
                    area: selectedSeat.id,
                    nomenclaturas: seleccionados,
                    id_usuario: user.id_usuario,
                    total: totalCompra
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert(`¡Asientos confirmados con éxito! Total a pagar: $${totalCompra}`);
                setSeleccionados([]);
                setTemporizadorActivo(false);
                setTiempoRestante(300);
                setPage('inicio');
            } else {
                alert(data.error || "No se pudo finalizar la compra. Intenta de nuevo.");
            }
        } catch (err) {
            console.error("Error al comprar asientos:", err);
            alert("Error al conectar con el servidor. Intenta de nuevo.");
        }
    };

    const navegarAPagina = async (nuevaPagina) => {
        if (temporizadorActivo) {
            const confirmar = window.confirm("Tienes una reserva activa. Si sales de esta página se liberarán tus asientos. ¿Deseas continuar?");
            if (!confirmar) return;
            await handleCancelarReserva();
        }
        setPage(nuevaPagina);
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

    const handleCerrarSesion = async () => {
        if (temporizadorActivo) {
            await handleCancelarReserva();
        }
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
                    <button className='button-menu-2' onClick={() => navegarAPagina('inicio')}>Inicio</button>
                </div>
                <div className="bar-boton-section">
                    <button className='button-menu-2' onClick={() => navegarAPagina('perfil')}>Mi perfil</button>
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
                                    <button className="dropdown-item" onClick={() => { navegarAPagina('wallet'); setDropdownOpen(false); }}>
                                        Wallet
                                    </button>
                                    <button className="dropdown-item" onClick={() => { navegarAPagina('ayuda'); setDropdownOpen(false); }}>
                                        Ayuda
                                    </button>
                                    <button className="dropdown-item danger" onClick={handleCerrarSesion}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className='button-menu' onClick={() => navegarAPagina('login')}>Iniciar sesión</button>
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
                                            const seatDb = asientosDb.find(a => a.nomenclatura === id);
                                            const isComprado = seatDb?.estado === 'comprado';
                                            const isReservadoPorOtro = seatDb?.estado === 'inactivo' && !seleccionados.includes(id);
                                            const isChecked = seleccionados.includes(id);
                                            return (
                                                <label key={id} className="asiento-label">
                                                    <input
                                                        type="checkbox"
                                                        disabled={loading || isComprado || isReservadoPorOtro || temporizadorActivo}
                                                        checked={isChecked}
                                                        onChange={() => manejarCambio(i, j)}
                                                        className="input-asiento-oculto"
                                                    />
                                                    <span className={`asiento-visual ${isComprado ? 'asiento-ocupado' : ''} ${isReservadoPorOtro ? 'asiento-reservado' : ''} ${temporizadorActivo ? 'asientos-bloqueados' : ''}`} />
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
                                            onClick={() => handleCancelarReserva()}
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