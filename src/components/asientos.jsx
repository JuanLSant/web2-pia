import { useState, useEffect } from 'react';

const SeleccionAsientos = () => {
    // Datos de ejemplo: 'L' = Libre, 'O' = Ocupado
    const [mapa, setMapa] = useState([
        ['L', 'L', 'O', 'L', 'L', 'L', 'L', 'L', 'O', 'L', 'L', 'L'],
        ['O', 'O', 'L', 'L', 'L', 'L', 'O', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'O', 'O'],
        ['O', 'L', 'L', 'L', 'O', 'O', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'O', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'O', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
        ['L', 'L', 'L', 'L', 'L', 'L', 'O', 'O', 'O', 'L', 'L', 'L'],
        
    ].map(fila => fila.map(estado => ({estado, expiraEn: null}))));

    const [seleccionados, setSeleccionados] = useState(() => {
        const guardados = localStorage.getItem('asientos_seleccionados');
        return guardados ? JSON.parse(guardados):[];
    });
    const precio = 5000;

    useEffect(()=>{
        localStorage.setItem('asientos_seleccionados', JSON.stringify(seleccionados));
    }, [seleccionados]);

    const TIEMPO_EXPIRACION = 10 * 60 * 1000; 
    
    useEffect(() => {
        const intervalo = setInterval(() => {
            const ahora = Date.now();
            let huboCambios = false;
            const mapaActualizado = mapa.map(fila =>
                fila.map(asiento => {
                    if (asiento.estado === 'P' && asiento.expiraEn && ahora > asiento.expiraEn) {
                        huboCambios = true;
                        return { estado: 'L', expiraEn: null }; 
                }
                return asiento;
            })
        );
        
        if (huboCambios) {
            setMapa(mapaActualizado);
        }
    }, 1000);

    return () => clearInterval(intervalo);
}, [mapa]);

 const manejarCambio = (fila, col) => {
    const id = `${fila}-${col}`;
    if (seleccionados.includes(id)) {
        setSeleccionados(seleccionados.filter(item => item !== id));
    } else {
        setSeleccionados([...seleccionados, id]);
    }
 };

 const iniciarProcesoPago = (fila, col) => {
    const mapaNuevo = [...mapa];
    mapaNuevo[fila][col] = {
        estado: 'P',
        expiraEn: Date.now() + TIEMPO_EXPIRACION
    };
    setMapa(mapaNuevo);
};

    return (
        <div className="index-background">
            <header className="header-estadio">
                <h1>Túnez vs Japón</h1>
                <p>Mundial 2026 - Fase de Grupos</p>
            </header>

            <main className="layout-principal">
                {/* ZONA DE MAPA */}
                <section className="contenedor-asientos">
                    <div className="cancha-linea">CANCHA</div>
                    
                    <form className="grid-estadio">
                        {mapa.map((fila, i) => (
                            <div key={i} className="fila-asientos">
                                {fila.map((asiento, j) => { 
                                    const id = `${i}-${j}`;
                                    const estaOcupado = asiento.estado === 'O';
                                    const estaEnProceso = asiento.estado === 'P'; 
                                    const estaSeleccionado = seleccionados.includes(id);
                                    let claseAsiento = 'asiento-visual';
                                    if (estaOcupado) claseAsiento += ' asiento-ocupado';
                                    else if (estaEnProceso) claseAsiento += ' asiento-proceso-pago'; 
                                    else if (estaSeleccionado) claseAsiento += ' asiento-seleccionado';
                                    return (
                                    <label key={id} className="asiento-label">
                                        <input 
                                        type="checkbox"
                                        disabled={estaOcupado || estaEnProceso} 
                                        checked={estaSeleccionado}
                                        onChange={() => manejarCambio(i, j)}
                                        className="input-asiento-oculto"
                                        />
                                        <span className={claseAsiento}>
                                            {estaEnProceso && "⏳"}
                                        </span>
                                     </label>
                                    
                                      );
                                            
                                })}
                            </div>
                        ))}
                    </form>
                </section>

                {/* ZONA DE PAGO */}
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
        </div>
    );
};

export default SeleccionAsientos;