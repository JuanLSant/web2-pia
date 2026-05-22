//HAY QUE AGREGAR EL PARTIDO 1 A LA BD (con el script en el archivo sql)

import { useState, useEffect, useRef } from 'react';

function Inicio({ user, setUser, setPage, setSelectedMatch }) {


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [partidos, setPartidos] = useState([]); 
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:8081/api/partidos')
            .then(response => {
                if (!response.ok) throw new Error('Error al traer partidos');
                return response.json();
            })
            .then(data => {
                setPartidos(data); 
            })
            .catch(error => console.error('Error cargando partidos dinámicos:', error));
    }, []);

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

    const simularCompra = () => {
        const mockData = {
            id_user: user?.id_user,
            total: 250.00,
            id_match: 1,      
            seat_number: 'H-12'
        };

        fetch('http://localhost:8081/simulate-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockData)
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                alert(" Pay: ¡Compra exitosa! Revisa tus boletos en 'Mi Perfil'");
            } else {
                alert("Error en la simulación. Revisa la consola.");
            }
        })
        .catch(err => console.error("Error:", err));
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
                                title={user?.username}
                                onClick={() => setDropdownOpen(prev => !prev)}
                            >
                                {user && user.username ? user.username.charAt(0).toUpperCase() : "?"}
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

                        {partidos.map((partido) => {
                            const localLower = partido.equipo_local.toLowerCase();
                            const visitanteLower = partido.equipo_visitante.toLowerCase();;

                            let imgLocal = localLower + '.jpg'; 
                            if (localLower === 'túnez' || localLower === 'tunez') imgLocal = 'Tunez.jpg';
                            if (localLower === 'sudáfrica' || localLower === 'sudafrica') imgLocal = 'sudáfrica.png';

                            let imgVisitante = visitanteLower + '.jpg';
                            if (visitanteLower === 'túnez' || visitanteLower === 'tunez') imgVisitante = 'Tunez.jpg';
                            if (visitanteLower === 'corea del sur') imgVisitante = 'sur corea.jpg';
                            if (visitanteLower === 'japón' || visitanteLower === 'japon') imgVisitante = 'japón.png';

                            return (
                                <div 
                                    key={partido.id_partido} 
                                    className="tarjeta-banner" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { 
                                        setSelectedMatch({
                                            id_partido: partido.id_partido,
                                            fecha: partido.fecha,
                                            flagLeft: `src/assets/${imgLocal}`,
                                            flagRight: `src/assets/${imgVisitante}`
                                        }); 
                                        setPage('zona'); 
                                    }}
                                >
                                    <div className="container-banderas">
                                        <div className="bandera">
                                            <img src={`src/assets/${imgLocal}`} alt={partido.equipo_local} />
                                        </div>
                                        <h1>VS</h1>
                                        <div className="bandera">
                                            <img src={`src/assets/${imgVisitante}`} alt={partido.equipo_visitante} />
                                        </div>
                                    </div>
                                    <div className="container-info-partido">
                                        <h1>{partido.equipo_local} VS {partido.equipo_visitante}</h1>
                                        <div className="container-fecha-partido">
                                            <p>{new Date(partido.fecha).toLocaleString('es-MX', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="tarjeta-banner"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inicio;