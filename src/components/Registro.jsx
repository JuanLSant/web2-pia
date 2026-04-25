import { useState } from 'react';

function Registro({ setEsRegistro }) {
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const manejarRegistro = async (e) => {
        e.preventDefault();

        
        if (username === "" || email === "" || password === "") {
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
            
            const response = await fetch('http://localhost:8081/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
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
        <div className="index-background">
            <h1 className="title-1">Crear Cuenta</h1>
            
            <form className="form-index" onSubmit={manejarRegistro}>
                <input 
                    className="input-index"
                    type='text' 
                    placeholder='Username' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />

                <input 
                    className="input-index"
                    type='email' 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <input 
                    className="input-index"
                    type='password' 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />

                <button className="button-index" type='submit'>
                    Registrarse
                </button>

                {error && <p className="error-message">{errorMessage}</p>}

                <p className='auth-link-Text'>
                    ¿Ya tienes cuenta? 
                    <span className='auth-link' 
                        onClick={() => setEsRegistro(false)}
                    >
                        Inicia sesión
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Registro;