import { useState } from 'react';

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
        
    ]);

    const [seleccionados, setSeleccionados] = useState([]);
    const precio = 5000;

const manejarCambio = (fila, col) => {
    const id = `${fila}-${col}`;
    if (seleccionados.includes(id)) {
        setSeleccionados(seleccionados.filter(item => item !== id));
    } else {
        setSeleccionados([...seleccionados, id]);
    }
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
                                            <span className={`asiento-visual ${estaOcupado ? 'asiento-ocupado' : ''}`}>
                                                {/* El cuadro del asiento */}
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