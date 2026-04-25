import { useState, useEffect, useRef } from 'react';
import bgWorldCup from '../assets/SC-World-Cup-Off-Plat-copy.webp';
import flagSurCorea from '../assets/sur corea.jpg';
import flagJapon from '../assets/japon.png';
import flagTunez from '../assets/Tunez.jpg';
import flagSuecia from '../assets/Suecia.jpg';
import flagSudafrica from '../assets/sudafrica.png';

const todasLasFechas = [
    '14 de Junio (8:00 pm)',
    '20 de Junio (8:00 pm)',
    '24 de Junio (8:00 pm)',
    '28 de Junio (8:00 pm)',
];

function MatchCard({ backgroundSrc, flagLeft, flagRight }) {
    return (
        <div className="match-card">
            <img className="match-card__bg" src={backgroundSrc} alt="fondo" />
            <div className="match-card__overlay">
                <div className="match-card__top-bar">
                    <img className="match-card__flag" src={flagLeft} alt="equipo local" />
                    <h1 className="match-card__vs">VS</h1>
                    <img className="match-card__flag" src={flagRight} alt="equipo visitante" />
                </div>
            </div>
        </div>
    );
}

function Zona({ user, setUser, setPage, selectedMatch }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

                        <div className="container-cols-zone">
                            <div className="container-izq-zone">
                                <MatchCard
                                    backgroundSrc="src/assets/SC-World-Cup-Off-Plat-copy.webp"
                                    flagLeft={selectedMatch?.flagLeft}
                                    flagRight={selectedMatch?.flagRight}
                                />
                                <div className="tablero-fechas">
                                    {todasLasFechas.map((fecha, index) => {
                                        const activa = selectedMatch?.fecha === fecha;
                                        return (
                                            <div
                                                key={index}
                                                className={`fecha-item ${activa ? 'fecha-activa' : 'fecha-inactiva'}`}
                                            >
                                                <p className="fecha-texto">{fecha}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="container-der-zone">
                                <div className="lado-izquierdo">
                                    <div className="arriba-E"></div>
                                    <div className="medio-E"></div>
                                    <div className="abajo-E"></div>
                                </div>
                                <div className="lado-derecho">
                                    <div className="lado-derecho-content">
                                        <div className="zona-ref">
                                            <img src={flagJapon} alt="zona" />
                                        </div>
                                        <h1 className="nombre-de-zona">Zona 1</h1>
                                        <h2 className="nombre-de-area">Area 1</h2>
                                        <p className="espacios-disp">Espacios disponibles: 37 / 37</p>
                                        <p className="costo-z">Costo de Zona: $5000 MXN</p>
                                        <div className="lado-derecho-footer">
                                            <button className="button-index" onClick={() => setPage('asientos')}>
                                                Ver Asientos
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default Zona;