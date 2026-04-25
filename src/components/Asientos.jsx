import { useState, useEffect, useRef } from 'react';

function Asientos({ user, setUser, setPage }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ── Estados de SeleccionAsientos ──────────────────────────────
    const [mapa] = useState([
        ['L', 'L', 'O', 'L', 'L', 'L', 'L', 'L', 'O', 'L', 'L', 'L'],
        ['O', 'O', 'L', 'L', 'L', 'L', 'O', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'O', 'O'],
        ['O', 'L', 'L', 'L', 'O', 'O', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'O', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'O', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'O', 'O', 'O', 'L', 'L', 'L'],
    ]);
    const [seleccionados, setSeleccionados] = useState([]);
    const precio = 5000;
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
                                {user.nombre.charAt(0).toUpperCase()}
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
                        {/* <h1>Túnez vs Japón</h1> */}
                        <p>Mundial 2026 - Fase de Grupos</p>
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
                                                        disabled={estaOcupado}
                                                        checked={seleccionados.includes(id)}
                                                        onChange={() => manejarCambio(i, j)}
                                                        className="input-asiento-oculto"
                                                    />
                                                    <span className={`asiento-visual ${estaOcupado ? 'asiento-ocupado' : ''}`} />
                                                </label>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className="panel-pago">
                            <h3>Resumen de Compra</h3>
                            <div className="detalle">
                                <p>Zona T7 - Estadio Azteca</p>
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
                            <button className="btn-siguiente" disabled={seleccionados.length === 0}>
                                Confirmar Boletos
                            </button>
                        </aside>
                    </main>
                    {/* ─────────────────────────────────── */}

                </div>
            </div>
        </div>
    );
}

export default Asientos;