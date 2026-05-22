import { useState, useEffect, useRef } from 'react';
 
function Inicio({ user, setUser, setPage, setSelectedMatch }) {
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
                    <div className="section-banner-ini">

                        <div className="tarjeta-banner" onClick={() => { setSelectedMatch({ id_partido: 1, flagLeft: 'src/assets/suecia.jpg', flagRight: 'src/assets/Tunez.jpg', fecha: '14 de Junio (8:00 pm)', titulo: 'Suecia VS Túnez' }); setPage('zona'); }}>
                            <div className="container-banderas">
                                <div className="bandera">
                                    <img src='src/assets/suecia.jpg' />
                                </div>
                                <h1>VS</h1>
                                <div className="bandera">
                                    <img src='src/assets/Tunez.jpg' />
                                </div>
                            </div>
                            <div className="container-info-partido">
                                <h1>Suecia VS Túnez</h1>
                                <div className="container-fecha-partido">
                                    <p>14 de Junio (8:00 pm) </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="tarjeta-banner" onClick={() => { setSelectedMatch({ id_partido: 2, flagLeft: 'src/assets/Tunez.jpg', flagRight: 'src/assets/Japon.png', fecha: '20 de Junio (8:00 pm)', titulo: 'Túnez VS Japón' }); setPage('zona'); }}>
                            <div className="container-banderas">
                                <div className="bandera">
                                    <img src='src/assets/Tunez.jpg' />
                                </div>
                                <h1>VS</h1>
                                <div className="bandera">
                                    <img src='src/assets/Japon.png' />
                                </div>
                            </div>
                            <div className="container-info-partido">
                                <h1>Túnez VS Japón</h1>
                                <div className="container-fecha-partido">
                                    <p>20 de Junio (8:00 pm) </p>
                                </div>
                            </div>
                        </div>
                        <div className="tarjeta-banner" onClick={() => { setSelectedMatch({ id_partido: 3, flagLeft: 'src/assets/sudafrica.png', flagRight: 'src/assets/sur corea.jpg', fecha: '24 de Junio (8:00 pm)', titulo: 'Sudáfrica VS Corea del Sur' }); setPage('zona'); }}>
                            <div className="container-banderas">
                                <div className="bandera">
                                    <img src='src/assets/sudafrica.png' />
                                </div>
                                <h1>VS</h1>
                                <div className="bandera">
                                    <img src='src/assets/sur corea.jpg' />
                                </div>
                            </div>
                            <div className="container-info-partido">
                                <h1>Sudáfrica VS Corea del Sur</h1>
                                <div className="container-fecha-partido">
                                    <p>24 de Junio (8:00 pm) </p>
                                </div>
                            </div>
                        </div>
                        <div className="tarjeta-banner"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Inicio;