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

// Mapeo de costos por zona
const costosZona = {
    'zona-1': 5000,
    'zona-2': 3500,
    'zona-3': 2000,
    'palcos': 10000
};

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

    // ==========================================
    // INICIO: LÓGICA DE SELECCIÓN DE ASIENTOS
    // ==========================================
    const [seleccion, setSeleccion] = useState({ 
        id: 'A-1', 
        zona: 'zona-1', 
        dPath: 'M397.042 153.284L383.01 154.671L383.945 167.33L397.977 165.943L397.042 153.284Z' // Path inicial por defecto
    });

    const handleEstadioClick = (e) => {
        const elemento = e.target;
        const idAsiento = elemento.id;
        
        // Buscamos a qué grupo pertenece
        const grupoZona = elemento.closest('#zona-1, #zona-2, #zona-3, #palcos');
        const esInactivo = elemento.closest('#zona-0, #Cancha, #fondo');

        if (!idAsiento || esInactivo || !grupoZona) return;

        setSeleccion({
            id: idAsiento,
            zona: grupoZona.id,
            dPath: elemento.getAttribute('d') // Guardamos el path para mostrarlo en la referencia
        });
    };
    // ==========================================
    // FIN: LÓGICA DE SELECCIÓN
    // ==========================================

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
                            <div className="avatar-menu" title={user.nombre} onClick={() => setDropdownOpen(prev => !prev)}>
                                {user.nombre.charAt(0).toUpperCase()}
                            </div>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" onClick={() => { setPage('wallet'); setDropdownOpen(false); }}>Wallet</button>
                                    <button className="dropdown-item" onClick={() => { setPage('ayuda'); setDropdownOpen(false); }}>Ayuda</button>
                                    <button className="dropdown-item danger" onClick={handleCerrarSesion}>Cerrar sesión</button>
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
                                backgroundSrc={bgWorldCup}
                                flagLeft={selectedMatch?.flagLeft}
                                flagRight={selectedMatch?.flagRight}
                            />
                            <div className="tablero-fechas">
                                {todasLasFechas.map((fecha, index) => {
                                    const activa = selectedMatch?.fecha === fecha;
                                    return (
                                        <div key={index} className={`fecha-item ${activa ? 'fecha-activa' : 'fecha-inactiva'}`}>
                                            <p className="fecha-texto">{fecha}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="container-der-zone">
                            <div className="lado-izquierdo">
                                <div className="arriba-E"></div>
                                <div className="medio-E">
                                    {/* ========================================== */}
                                    {/* INICIO: CANCHA SVG INTEGRADA */}
                                    {/* ========================================== */}
                                    <svg viewBox="0 0 685 582" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleEstadioClick}>
                                        <style>
                                            {`
                                                path { transition: fill 0.2s; }
                                                /* Zonas Interactivas */
                                                #zona-1 path, #zona-2 path, #zona-3 path, #palcos path { cursor: pointer; fill: #838383; }
                                                #zona-1 path:hover, #zona-2 path:hover, #zona-3 path:hover, #palcos path:hover { fill: #b0b0b0; }
                                                
                                                /* Zona 0 y Fondo Bloqueados */
                                                #zona-0 path { fill: #2a2a2a !important; cursor: default; pointer-events: none; }
                                                #fondo, #Cancha { cursor: default; }

                                                /* Resaltado del Asiento Seleccionado */
                                                [id="${seleccion.id}"] { fill: #FFD700 !important; stroke: white; stroke-width: 1px; }
                                            `}
                                        </style>
                                        <g id="Estadio">
                                            <rect id="fondo" opacity="0.48" width="685" height="582" rx="230" fill="#959ABE"/>
                                            <g id="Secciones">
                                                {/* Aquí pones los grupos del SVG que me pasaste */}
                                                <g id="zona-0"> 
                                                <path id="F-6" d="M359.5 169.5H339V139.5H350L355.5 135H359.5V169.5Z" fill="#838383" stroke="black"/>
                                                <path id="F-5" d="M328.5 170H337V139H312.5V170H321.5V144H328.5V170Z" fill="#838383" stroke="black"/>
                                                <path id="F-4" d="M289 170H310V139H298L292.5 134H289V170Z" fill="#838383" stroke="black"/>
                                                <path id="F-3" d="M344 448H338.5V414H359.5V454H351L344 448Z" fill="#838383" stroke="black"/>
                                                <path id="F-2" d="M336 448.5H313.5V415H336V448.5Z" fill="#838383" stroke="black"/>
                                                <path id="F-1" d="M297.5 454H288.5V414.5H311.5V448H305.5L297.5 454Z" fill="#838383" stroke="black"/>
                                                </g>
                                                <g id="zona-1">
                                                <path id="A-53" d="M129 79.5L118 85L110 69L122 62.5L129 79.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-52" d="M131 78L123.5 62L152 50.5L154.5 68.5L131 78Z" fill="#838383" stroke="black"/>
                                                <path id="A-51" d="M179.5 64L157 68.5L154 50L180 43L179.5 64Z" fill="#838383" stroke="black"/>
                                                <path id="A-50" d="M199 65H181L182 42.5L199 38.5V65Z" fill="#838383" stroke="black"/>
                                                <path id="A-49" d="M223.5 65H200.5L201 38L223.5 34V65Z" fill="#838383" stroke="black"/>
                                                <path id="A-48" d="M248.5 64.5H225.5V33.5L248.5 30.5V64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-47" d="M273.5 64.5H250.5L251 30L274 27L273.5 64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-46" d="M298 64.5H275.5L276 27L298.5 26.5L298 64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-45" d="M323.5 64.5H300L300.5 26L323.5 25.5V64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-44" d="M325 64.5V26V25.5H348L348.5 65L325 64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-43" d="M351 65L350 26L374 27.5V65H351Z" fill="#838383" stroke="black"/>
                                                <path id="A-42" d="M376.5 64.5V27L399 29L398.5 64.5H376.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-41" d="M422.5 64.5H401.5V28.5L422.5 31V64.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-40" d="M425 65V31.5L447.5 34.5V65H425Z" fill="#838383" stroke="black"/>
                                                <path id="A-39" d="M450 64.5V34.5L467 38V64.5H450Z" fill="#838383" stroke="black"/>
                                                <path id="A-38" d="M492.5 65L469.5 64.5L469 38L494.5 44.5L492.5 65Z" fill="#838383" stroke="black"/>
                                                <path id="A-37" d="M520.5 72L495 65.5L499 45.5L527 56.5L520.5 72Z" fill="#838383" stroke="black"/>
                                                <path id="A-36" d="M546 86L522.5 74L529.5 58L556.5 72L546 86Z" fill="#838383" stroke="black"/>
                                                <path id="A-35" d="M570 103.5L549 87L560 72.5L583.5 90.5L570 103.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-34" d="M589.5 127L572 105.5L586 91.5L608.5 113.5L589.5 127Z" fill="#838383" stroke="black"/>
                                                <path id="A-33" d="M602.5 154L591 129L610.5 116L627.5 143.5L602.5 154Z" fill="#838383" stroke="black"/>
                                                <path id="A-32" d="M610.5 181L602.5 156L628.5 145.5L640.5 176L610.5 181Z" fill="#838383" stroke="black"/>
                                                <path id="A-31" d="M646 206.5H611.5V183.5L641 178L646 206.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-30" d="M648.5 229.5H611V209.5H647.5L648.5 229.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-29" d="M611 255V232H649V255H611Z" fill="#838383" stroke="black"/>
                                                <path id="A-28" d="M611.5 279V257.5H649.5V279.5L611.5 279Z" fill="#838383" stroke="black"/>
                                                <path id="A-27" d="M612 306.5V281.5L649.5 282.5V306.5H612Z" fill="#838383" stroke="black"/>
                                                <path id="A-26" d="M611 331L610.5 308.5H649.5V331H611Z" fill="#838383" stroke="black"/>
                                                <path id="A-25" d="M611 356.5V333H649V356.5H611Z" fill="#838383" stroke="black"/>
                                                <path id="A-24" d="M611.5 380V359H649L647.5 380H611.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-23" d="M612 382L611 405.5L641.5 411L647 382H612Z" fill="#838383" stroke="black"/>
                                                <path id="A-22" d="M628 445.5L602 434L610 408L639.5 414L628 445.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-21" d="M610 473.5L588.5 459.5L602 436L627.5 447.5L610 473.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-20" d="M586.5 498L570 481.5L587 461.5L609 476L586.5 498Z" fill="#838383" stroke="black"/>
                                                <path id="A-19" d="M559 517.5L547 499.5L568 483.5L584.5 499.5L559 517.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-18" d="M529.5 532L520 512L544.5 500.5L557 519L529.5 532Z" fill="#838383" stroke="black"/>
                                                <path id="A-17" d="M498 541.5C497.2 541.5 494.667 526.833 493.5 519.5L518.5 512.5L527.5 532.5C518 535.5 498.8 541.5 498 541.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-16" d="M469 548.5V521L491.5 520L495.5 543L469 548.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-15" d="M449.5 553L450.5 521H466.5V550L449.5 553Z" fill="#838383" stroke="black"/>
                                                <path id="A-14" d="M425 556.5V521L448 521.5V553L425 556.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-13" d="M400.5 558.5L401.5 521H423V557L400.5 558.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-12" d="M377 560V521H399.5L398.5 558.5L377 560Z" fill="#838383" stroke="black"/>
                                                <path id="A-11" d="M351 562V521H374.5V560L351 562Z" fill="#838383" stroke="black"/>
                                                <path id="A-10" d="M325.5 562V521H349V562H325.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-9" d="M301 561.5L300.5 521H324V562.5L301 561.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-8" d="M275.5 559V521.5H298.5L299 561.5L275.5 559Z" fill="#838383" stroke="black"/>
                                                <path id="A-7" d="M252.5 556.5V521.5H273.5V560L252.5 556.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-6" d="M226 552L226.5 521.5H250L250.5 557L226 552Z" fill="#838383" stroke="black"/>
                                                <path id="A-5" d="M201.5 547.5V521H224V552.5L201.5 547.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-4" d="M183 543V520.5H200V547.5L183 543Z" fill="#838383" stroke="black"/>
                                                <path id="A-3" d="M156 535L157 517.5L181 520.5V543L156 535Z" fill="#838383" stroke="black"/>
                                                <path id="A-2" d="M154 533.5L126.5 522L132.5 508L155.5 517.5L154 533.5Z" fill="#838383" stroke="black"/>
                                                <path id="A-1" d="M124 522L112 515.5L120 500.5L131 507L124 522Z" fill="#838383" stroke="black"/>
                                                </g>
                                                <g id="zona-2">
                                                <path id="B-53" d="M138 101.5L129.5 105.5L119.5 87L130.5 81L138 101.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-52" d="M159.5 93.5L139.5 100.5L132 81L155.5 71.5L159.5 93.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-51" d="M180 90L161.5 92.5L157.5 70.5L179.5 66.5L180 90Z" fill="#838383" stroke="black"/>
                                                <path id="B-50" d="M198.5 90H181.5L181 66.5H198.5V90Z" fill="#838383" stroke="black"/>
                                                <path id="B-49" d="M223.5 89.5H200V66.5H223.5V89.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-48" d="M248.5 89.5H225.5V66H248.5V89.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-47" d="M273 89.5H250.5V66.5H273V89.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-46" d="M298 89.5H275.5V66.5H298V89.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-45" d="M323.5 90H300V66.5H323.5V90Z" fill="#838383" stroke="black"/>
                                                <path id="B-44" d="M325 90H348.5V66.5H325V90Z" fill="#838383" stroke="black"/>
                                                <path id="B-43" d="M374 89.5H350.5L351 67.5L374 68.5V89.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-42" d="M377 89.5V68H399V89.5H377Z" fill="#838383" stroke="black"/>
                                                <path id="B-41" d="M401.5 89.5V68L422.5 67.5L423 89.5H401.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-40" d="M425 90V67.5H447.5V90H425Z" fill="#838383" stroke="black"/>
                                                <path id="B-39" d="M450 89.5V67.5H467V89.5H450Z" fill="#838383" stroke="black"/>
                                                <path id="B-38" d="M487 91.5L469 90V68L491.5 70L487 91.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-37" d="M510 99.5L489.5 93L494 68.5L518 76L510 99.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-36" d="M529 110L512 100.5L521 77.5L544 89L529 110Z" fill="#838383" stroke="black"/>
                                                <path id="B-35" d="M549 126.5L532 111.5L547.5 90.5L568 106.5L549 126.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-34" d="M563.5 144.5L550.5 128.5L569.5 108.5L587 128.5L563.5 144.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-33" d="M575 165.5L564.5 146.5L588 131L600.5 154.5L575 165.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-32" d="M581.5 187L575 167.5L600.5 157L608 182L581.5 187Z" fill="#838383" stroke="black"/>
                                                <path id="B-31" d="M609.5 206.5H583.5L582.5 189.5L609.5 184V206.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-30" d="M609 229.5H584V209H609V229.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-29" d="M583.5 255V232H609V255H583.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-28" d="M584 279V257.5H609V279.5L584 279Z" fill="#838383" stroke="black"/>
                                                <path id="B-27" d="M584 305.5V281L609.5 282V305.5H584Z" fill="#838383" stroke="black"/>
                                                <path id="B-26" d="M584.5 331.5V308.5H609V331.5H584.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-25" d="M585 356V333H609V356H585Z" fill="#838383" stroke="black"/>
                                                <path id="B-24" d="M585 380V358.5H609.5V380H585Z" fill="#838383" stroke="black"/>
                                                <path id="B-23" d="M607.5 404.5L582.5 400L584.5 381.5H609.5L607.5 404.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-21" d="M586 458L563 442L573.5 424.5L598.5 435L586 458Z" fill="#838383" stroke="black"/>
                                                <path id="B-22" d="M599 433L574.5 422.5L582 402L606.5 407L599 433Z" fill="#838383" stroke="black"/>
                                                <path id="B-20" d="M568.5 480L548 459.5L561.5 444L585 459.5L568.5 480Z" fill="#838383" stroke="black"/>
                                                <path id="B-19" d="M545 497L530 474L547.5 461.5L566 481.5L545 497Z" fill="#838383" stroke="black"/>
                                                <path id="B-18" d="M519.5 509.5L509.5 486L529 475.5L543 498L519.5 509.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-17" d="M492.5 516L487.5 493L508 487L517.5 510.5L492.5 516Z" fill="#838383" stroke="black"/>
                                                <path id="B-16" d="M469 518V495L486 493.5L491 516.5L469 518Z" fill="#838383" stroke="black"/>
                                                <path id="B-15" d="M450 517.5V495.5L466.5 496L466 517.5H450Z" fill="#838383" stroke="black"/>
                                                <path id="B-14" d="M425.5 518V496H448V518H425.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-13" d="M401.5 517.5V496H423V517.5H401.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-12" d="M377 517.5V496H400V517.5H377Z" fill="#838383" stroke="black"/>
                                                <path id="B-11" d="M351 517.5V496H375V517.5H351Z" fill="#838383" stroke="black"/>
                                                <path id="B-10" d="M326 518V495.5L349 496L349.5 518H326Z" fill="#838383" stroke="black"/>
                                                <path id="B-9" d="M301 518V495.5H324V518H301Z" fill="#838383" stroke="black"/>
                                                <path id="B-8" d="M277 518V495L299 495.5V518H277Z" fill="#838383" stroke="black"/>
                                                <path id="B-7" d="M252 518V495H275V518H252Z" fill="#838383" stroke="black"/>
                                                <path id="B-6" d="M226.5 518.5V495H250V518.5H226.5Z" fill="#838383" stroke="black"/>
                                                <path id="B-5" d="M201 518V495H224.5V518H201Z" fill="#838383" stroke="black"/>
                                                <path id="B-4" d="M183 518V495H199.5V518H183Z" fill="#838383" stroke="black"/>
                                                <path id="B-3" d="M162.5 492.5C166 493 174.6 494.1 181 494.5V518L159.5 515L162.5 492.5Z" fill="#838383" stroke="black"/>
                                                <g id="B-2">
                                                <path d="M158 515L132.682 505.071L141 485.5L161 491.5L158 515Z" fill="#838383"/>
                                                <path d="M132.5 505L158 515L161 491.5L141 485.5L132.5 505.5" stroke="black"/>
                                                </g>
                                                <path id="B-1" d="M131.5 503.5L120.5 497L130 480.5L139 486L131.5 503.5Z" fill="#838383" stroke="black"/>
                                                </g>
                                                <g id="zona-3">
                                                <path id="C-41" d="M149.5 279H76.5V255.5H149.5V279Z" fill="#838383" stroke="black"/>
                                                <path id="C-42" d="M149 305H77V281H149V305Z" fill="#838383" stroke="black"/>
                                                <path id="C-43" d="M149.5 330.5H76.5V307H149.5V330.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-44" d="M149 355H76.5L76 332.5H149V355Z" fill="#838383" stroke="black"/>
                                                <path id="C-45" d="M149 375.5H76.5V356.5C100.5 356.667 148.6 357 149 357C149.4 357 149.167 369.333 149 375.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-46" d="M149 389L85.5 417L80 402L77 377H147L149 389Z" fill="#838383" stroke="black"/>
                                                <path id="C-39" d="M149 227.5H77L76.5 210L149 210.5V227.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-40" d="M149 254H76.5V229.5H149V254Z" fill="#838383" stroke="black"/>
                                                <path id="C-36" d="M165.5 181L170.5 178L142.5 112L126.5 120.5L110.5 135L124.5 148.5L128.5 144.5L165.5 181Z" fill="#838383" stroke="black"/>
                                                <path id="C-37" d="M122.5 149.5L109 136.5L96 151L87.5 169L151.5 196L155 191L118.5 154.5L122.5 149.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-38" d="M150.5 198.5L149 208.5H78L79 192L86.5 171L150.5 198.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-35" d="M178 174.5L171.5 177L144.5 111L172.5 103H198V174L178 174.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-33" d="M248.5 174H225.5V102H248.5V174Z" fill="#838383" stroke="black"/>
                                                <path id="C-34" d="M223.5 174.5H200V102.5H223.5V174.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-31" d="M286.5 173.5H265V103H286.5V173.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-32" d="M263.5 174H250.5V103H263.5V174Z" fill="#838383" stroke="black"/>
                                                <path id="C-30" d="M384.5 173.5H362V103.5H384.5V173.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-29" d="M399 174H387V103.5H399V174Z" fill="#838383" stroke="black"/>
                                                <path id="C-27" d="M448 174.5H424.5V103H448V174.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-28" d="M423 174.5H401V103.5H423V174.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-26" d="M477.5 105L449.5 103.5L450.5 174H464L477.5 176L505 111L477.5 105Z" fill="#838383" stroke="black"/>
                                                <path id="C-15" d="M562.5 417.5L498.5 390.5L501.5 378.5H572L569 396.5L562.5 417.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-16" d="M572 374H501V357.5H572V374Z" fill="#838383" stroke="black"/>
                                                <path id="C-17" d="M572.5 354.5H500.5V332H572.5V354.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-18" d="M572.5 329.5H501V307H572.5V329.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-19" d="M571.5 303.5H501.5V281.5H571.5V303.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-20" d="M571.5 278.5H501V256H571.5V278.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-21" d="M572 253.5H501V230H572V253.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-22" d="M573 227.5H500.5V210H573V227.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-23" d="M572.5 208H500L499 199L565.5 171.5L571 188L572.5 208Z" fill="#838383" stroke="black"/>
                                                <path id="C-24" d="M564.5 170.5L498.5 197.5L492 187.5L542 136L555 151L564.5 170.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-25" d="M490 185L480.5 177.5L507.5 112L524.5 121L540 134.5L490 185Z" fill="#838383" stroke="black"/>
                                                <path id="C-14" d="M539.5 451L490.5 402L496.5 392.5L561 419L553.5 436L539.5 451Z" fill="#838383" stroke="black"/>
                                                <path id="C-13" d="M505 474L480.5 410L488.5 404L538 453L523 465L505 474Z" fill="#838383" stroke="black"/>
                                                <path id="C-12" d="M480.5 482.5H450.5V414H469.5L478.5 410.5L503.5 475L480.5 482.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-11" d="M447.5 482.5H425V414H447.5V482.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-10" d="M423 482H401.5V414H423V482Z" fill="#838383" stroke="black"/>
                                                <path id="C-9" d="M399.5 482H387.5V415H399.5V482Z" fill="#838383" stroke="black"/>
                                                <path id="C-8" d="M385.5 414.5H362V482H385.5V414.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-7" d="M286 483H265.5V414.5H286V483Z" fill="#838383" stroke="black"/>
                                                <path id="C-6" d="M263 482.5H250.5V414H263.5L263 482.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-5" d="M248.5 482.5L226 483V414H248.5V482.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-4" d="M224 483H201V414.5H224V483Z" fill="#838383" stroke="black"/>
                                                <path id="C-3" d="M167.5 483L144.5 475.5L170 412.5L178 414.5H198.5V483H167.5Z" fill="#838383" stroke="black"/>
                                                <path id="C-2" d="M126.5 466L111 454.5L159 404.5L168 410.5L142 474L126.5 466Z" fill="#838383" stroke="black"/>
                                                <path id="C-1" d="M96.5 440L86.5 420L150 392.5L156.5 404L109.5 453.5L96.5 440Z" fill="#838383" stroke="black"/>
                                                </g>
                                                <g id="palcos">
                                                <path id="P-2" d="M294 132H288.5V103.5H360V132H355L349 136.5H298.5L294 132Z" fill="#838383" stroke="black"/>
                                                <path id="P-1" d="M289 456.5L288.5 482H360V456.5H350L343 451H306.5L299.5 456.5H289Z" fill="#838383" stroke="black"/>
                                                </g>
                                                <g id="Cancha">
                                                <g id="area">
                                                <path d="M179 308H169.5V279H179V268V239.25V199.5H324.75H470.5V239.25V268V279H481V308H470.5V319.5V350.5V388.5H324.75H179V350.5V319.5V308Z" fill="#838383"/>
                                                <path d="M179 308H169.5V279H179M179 308V279M179 308V319.5M179 279V268M470.5 308H481V279H470.5M470.5 308V268M470.5 308C470.5 312.042 470.5 315.856 470.5 319.5M179 239.25V199.5H324.75M179 239.25H225V274M179 239.25V268M179 350.5V388.5H324.75M179 350.5H225V314M179 350.5V319.5M179 268H195V319.5H179M470.5 268H454.5V319.5H470.5M470.5 268V239.25M470.5 319.5C470.5 330.893 470.5 340.628 470.5 350.5M470.5 239.25V199.5H324.75M470.5 239.25H424V274.5M470.5 350.5C470.5 362.028 470.5 373.742 470.5 388.5H324.75M470.5 350.5H424V314.5M324.75 199.5V388.5M225 314C232.845 308.985 235.549 304.033 236 293.5C235.233 283.585 232.124 279.737 225 274M225 314V274M424 314.5C416.455 307.358 414.44 302.405 414 295C414.519 286.223 417.164 281.076 424 274.5M424 314.5V274.5" stroke="black"/>
                                                </g>
                                                <circle id="centro" cx="324" cy="294" r="26.5" stroke="black"/>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    {/* ========================================== */}
                                    {/* FIN: CANCHA SVG */}
                                    {/* ========================================== */}
                                </div>
                            </div>

                            <div className="lado-derecho">
                                <div className="lado-derecho-content">
                                    <div className="zona-ref">
                                        {/* Visualización del mini-vector seleccionado */}
                                        <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                                            <path 
                                                d={seleccion.dPath} 
                                                fill="#FFD700" 
                                                transform="scale(1.5)" 
                                                transform-origin="center"
                                            />
                                        </svg>
                                    </div>
                                    <h1 className="nombre-de-zona" style={{textTransform: 'capitalize'}}>
                                        {seleccion.zona.replace('-', ' ')}
                                    </h1>
                                    <h2 className="nombre-de-area">Asiento: {seleccion.id}</h2>
                                    <p className="espacios-disp">Estado: Disponible</p>
                                    <p className="costo-z">Costo: ${costosZona[seleccion.zona]} MXN</p>
                                    <div className="lado-derecho-footer">
                                        <button className="button-index" onClick={() => setPage('asientos')}>
                                            Reservar {seleccion.id}
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