import { useState, useEffect, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';

function Asientos({ user, setUser, setPage, selectedMatch, zonaElegida }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const googlePayContainerRef = useRef(null);

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

    const [datosZonaBD, setDatosZonaBD] = useState(null);

    const precio = datosZonaBD?.precio || 0;
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (zonaElegida?.id) {
            fetch(`http://localhost:8081/api/zonas/${zonaElegida.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Error al obtener la zona');
                    return res.json();
                })
                .then(data => {
                    setDatosZonaBD(data);
                })
                .catch(err => console.error("Error cargando precio de la BD:", err));
        }
    }, [zonaElegida]);
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (seleccionados.length === 0 || !window.google || !window.google.payments) {
            if (googlePayContainerRef.current) {
                googlePayContainerRef.current.innerHTML = ''; 
            }
            return;
        }

        const totalPagar = (seleccionados.length * precio).toString();

        const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: 'TEST',
        });

        const baseConfiguration = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                    },
                },
            ],
        };

    paymentsClient.isReadyToPay(baseConfiguration)
            .then((response) => {
                if (response.result) {
                    if (googlePayContainerRef.current) {
                        googlePayContainerRef.current.innerHTML = '';
                    }

                    const button = paymentsClient.createButton({
                        buttonColor: 'black',
                        buttonType: 'buy',
                        onClick: () => {
                            const paymentDataRequest = {
                                ...baseConfiguration,
                                transactionInfo: {
                                    totalPriceStatus: 'FINAL',
                                    totalPrice: totalPagar,
                                    currencyCode: 'MXN',
                                    countryCode: 'MX',
                                },
                                merchantInfo: {
                                    merchantName: 'Mundial 2026 Ticketing',
                                },
                            };

                            paymentsClient.loadPaymentData(paymentDataRequest)
                                .then((paymentData) => {
                                    registrarCompraExitosa({ id: paymentData.id || 'G-PAY-TEST', status: 'COMPLETED' });
                                })
                                .catch((err) => console.error('Pago cancelado o error:', err));
                        },
                    });

                    if (googlePayContainerRef.current) {
                        googlePayContainerRef.current.appendChild(button);
                    }
                }
            })
            .catch((err) => console.error('Error inicializando Google Pay:', err));

    }, [seleccionados, precio]);


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

    const registrarCompraExitosa = async (details, metodoPagoId = 1) => {
    try {
        const totalPagar = seleccionados.length * precio;
        
        console.log("Partido seleccionado actual:", selectedMatch);
        const response = await fetch('http://localhost:8081/api/crear-boleto-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: user?.correo || user?.email || 'ola@correo.com',
                id_metodo: metodoPagoId,
                total: totalPagar,
                id_partido: selectedMatch?.id_partido || selectedMatch?.id_partidos || selectedMatch?.id || null,
                asientos: seleccionados,
                id_zona: zonaElegida.id || 1
            })
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    title: '¡Compra Procesada con Éxito!',
                    text: 'Tus asientos se han registrado correctamente. Ya puedes ver tus pases en la Wallet.',
                    icon: 'success',
                    background: '#1a1a1a',      
                    color: '#ffffff',          
                    confirmButtonColor: '#ff9800', 
                    confirmButtonText: 'Ir a mi Wallet'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setPage('perfil');
                    }
                });
            }
        } else {
            Swal.fire({
                title: 'Error en el servidor',
                text: 'Hubo un problema al procesar las tablas de ventas/boletos en el backend.',
                icon: 'error',
                background: '#1a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#d33'
            });
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        Swal.fire({
            title: 'Error de Conexión',
            text: 'No se pudo establecer comunicación con el backend.',
            icon: 'warning',
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#ff9800'
        });
    }
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
                                <p> {datosZonaBD?.nombre_zona ? datosZonaBD.nombre_zona.charAt(0).toUpperCase() + datosZonaBD.nombre_zona.slice(1)   : 'Cargando Zona...'} - Estadio BBVA</p>
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
            <div style={{ marginTop: '20px' }}>
                {seleccionados.length > 0 ? (
                  <>
                    <PayPalScriptProvider options={{ "client-id": "test" }}>
                        <PayPalButtons 
                            style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: (seleccionados.length * precio).toString()
                                        }
                                    }]
                                });
                            }}
                            onApprove={async (data, actions) => {
                                const details = await actions.order.capture();
                               
                                registrarCompraExitosa(details); 
                            }}
                            onError={(err) => {
                                console.error("Error en PayPal:", err);
                                alert("Ocurrió un error al procesar el pago con PayPal.");
                            }}
                        />
                    </PayPalScriptProvider>
                    
                    <div 
                        ref={googlePayContainerRef} 
                        style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }} 
                     />
                 </>
                    
                ) : (
                    <button className="btn-siguiente" disabled>
                        Confirmar Boletos
                    </button>
                )}
            </div>
            
                        </aside>
                    </main>
                    {/* ─────────────────────────────────── */}

                </div>
            </div>
        </div>
    );
}

export default Asientos;