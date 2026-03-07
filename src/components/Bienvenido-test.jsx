import { useState, useEffect } from 'react';

function Welcome ({user, setUser}){
        
    const [datos, setDatos] = useState({ nombre: '', correo: '', password: '' });
    const [mensaje, setMensaje] = useState('');

    
    useEffect(() => {
        if (user?.id_usuario) {
            fetch(`http://localhost:8081/usuario/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setDatos({
                        nombre: data.nombre,
                        correo: data.correo,
                        password: ''
                    });
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
            setMensaje("Datos actualizados correctamente");
            setUser(prev => ({ ...prev, nombre: datos.nombre }));
        })
        .catch(() => setMensaje("Error al guardar cambios"));
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
                    <button className='button-menu'>Iniciar sesión</button>
                </div>
            </footer>
            <div className="container-content-dashboard">
                <div className="section-left">
                    <form className='form-datauser'>

                        <div className="section-top-center">
                            <div className="container-image">
                                <img src='src/assets/user-t.jpg'></img>
                            </div>
                        </div>
                        <div className="section-middle-center">
                                <div className="container-input">
                                    <p>Usuario</p>
                                    <input
                                    className="input-index"
                                    type='text' 
                                    placeholder={user.nombre} 
                                    />
                                </div>
                                <div className="container-input">
                                    <p>Email</p>
                                    <input
                                    className="input-index"
                                    type='email' 
                                    placeholder={user.correo} 
                                    />
                                </div>
                                <div className="container-input">
                                    <p>Password</p>
                                    <input
                                    className="input-index"
                                    type='password' 
                                    placeholder='new password' 
                                    />
                                </div>
                        </div>
                        <div className="section-botton-center">
                            <button className='button-index'>Guardar</button>
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