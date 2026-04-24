import { useState, useEffect } from 'react';

function Welcome ({user, setUser}){
    const [datos, setDatos] = useState({ nombre: '', correo: '', password: '' });
    const [mensajeOk, setMensajeOk] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        if (user) {
            setDatos({
                nombre: user.nombre,
                correo: user.correo,
                password: ''
            });
        }
    }, [user]);

const handleGuardar = () => {
    fetch(`http://localhost:8081/usuario/${user.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: datos.nombre, password: datos.password })
    })
    .then(res => res.json())
    .then(() => {
        setMensajeOk("Datos actualizados correctamente");
        setMensajeError('');
        setUser(prev => ({ ...prev, nombre: datos.nombre }));
    })
    .catch(() => {
        setMensajeError("Error al guardar cambios");
        setMensajeOk('');
    });
};

    return (
        <div className="background-page">
           <footer className='bar-menu'>
                <div className="bar-space"></div>
                <div className="bar-boton-section">
                    <button className='button-menu-2'>Inicio</button>
                </div>
                <div className="bar-boton-section">
                    <button className='button-menu-2'>Mi perfil</button>
                </div>
                <div className="bar-boton-section">
                    {user ? (
                        <div className="avatar-menu" title={user.nombre}>
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <button className='button-menu'>Iniciar sesión</button>
                    )}
                </div>
            </footer>
            <div className="container-content-dashboard">
                <div className="section-left">
                    <form className='form-datauser' onSubmit={e => e.preventDefault()}>
                        <div className="section-top-center">
                            <div className="container-image">
                                <img src='src/assets/user-t.jpg' />
                            </div>
                        </div>
                        <div className="section-middle-center">
                            <div className="container-input">
                                <p>Usuario</p>
                                <input
                                    className="input-index"
                                    type='text'
                                    placeholder={user.nombre}
                                    value={datos.nombre}
                                    onChange={e => setDatos({ ...datos, nombre: e.target.value })}
                                />
                            </div>
                            <div className="container-input">
                                <p>Email</p>
                                <input
                                    className="input-index"
                                    type='email'
                                    placeholder={user.correo}
                                    value={datos.correo}
                                    disabled
                                />
                            </div>
                            <div className="container-input">
                                <p>Password</p>
                                <input
                                    className="input-index"
                                    type='password'
                                    placeholder='Nueva contraseña'
                                    value={datos.password}
                                    onChange={e => setDatos({ ...datos, password: e.target.value })}
                                />
                            </div>
                        </div>
                        {mensajeOk && <p className="success-message">{mensajeOk}</p>}
                        {mensajeError && <p className="error-message">{mensajeError}</p>}
                        <div className="section-botton-center">
                            <button className='button-index' onClick={handleGuardar}>Guardar</button>
                        </div>
                    </form>
                </div>
                <div className="section-right">
                    <div className="section-top">
                        <h1>Mis Boletos</h1>
                    </div>
                    <div className="section-botton">
                        <div className="tarjeta-banner"></div>
                        <div className="tarjeta-banner"></div>
                        <div className="tarjeta-banner"></div>
                        <div className="tarjeta-banner"></div>
                        <div className="tarjeta-banner"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome;