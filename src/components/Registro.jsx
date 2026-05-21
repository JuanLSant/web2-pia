import { useState } from 'react';
import userRoundIcon from '../assets/user-round.svg';
import atSignIcon from '../assets/at-sign.svg';
import lockIcon from '../assets/lock.svg';

function Registro({ setEsRegistro }) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const manejarRegistro = async (e) => {
        e.preventDefault();

        if (nombre === "" || email === "" || password === "") {
            setError(true);
            setErrorMessage("Todos los campos son obligatorios");
            return;
        }

        if (!email.includes("@")) {
            setError(true);
            setErrorMessage("Por favor ingresa un correo válido");
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();

            if (data === "Success") {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                setEsRegistro(false); 
            } else {
                setError(true);
                setErrorMessage("Error al registrar el usuario");
            }
        } catch (err) {
            setError(true);
            setErrorMessage("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="login-wrap">
            <div className="login-card">
                <h1 className="login-title">Bienvenido</h1>
                <p className="login-subtitle">Crear una cuenta</p>
                
                <form onSubmit={manejarRegistro}>
                    <div className="field-wrap">
                        <img className="field-icon" src={userRoundIcon} alt="User" />
                        <input 
                            className="login-input"
                            type='text' 
                            placeholder='Nombre completo' 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                        />
                    </div>

                    <div className="field-wrap">
                        <img className="field-icon" src={atSignIcon} alt="Email" />
                        <input 
                            className="login-input"
                            type='email' 
                            placeholder='Correo electrónico' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="field-wrap">
                        <img className="field-icon" src={lockIcon} alt="Lock" />
                        <input 
                            className="login-input"
                            type='password' 
                            placeholder='Contraseña' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button className="login-btn" type='submit'>
                        Registrarse
                    </button>

                    {error && <p className="error-message">{errorMessage}</p>}
                </form>

                <p className='register-row'>
                    ¿Ya tienes cuenta? 
                    <span className='register-link' 
                        onClick={() => setEsRegistro(false)}
                    >
                        Inicia sesión
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Registro;