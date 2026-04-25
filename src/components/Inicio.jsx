//HAY QUE AGREGAR EL PARTIDO 1 A LA BD (con el script en el archivo sql)

import { useState, useEffect, useRef } from 'react';

function Inicio({ user, setUser, setPage }) {
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
                {/* BOTON PROVISIONAL DE SIMULACION WALET */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    gap: '20px' 
                }}>
                    <h2 style={{ color: 'white', fontFamily: 'Arial' }}>Simulación de Venta</h2>
                    
                    <button 
                        style={{
                            backgroundColor: 'white', 
                            color: 'black', 
                            padding: '15px 30px', 
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0px 4px 15px rgba(0,0,0,0.3)'
                        }}
                        onClick={simularCompra}
                    >
                        <span style={{ fontSize: '24px' }}></span> Pay
                    </button>
                    
                    <p style={{ color: '#aaa', fontSize: '14px' }}>
                        (Haz clic para simular una compra de boleto para el Match 1)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Inicio;