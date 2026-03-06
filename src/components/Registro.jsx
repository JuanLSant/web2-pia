import { useState } from 'react';


function Registro({ setEsRegistro }) {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const manejarRegistro = (e) => {
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

        
        console.log("Usuario registrado:", { nombre, email, password });
        
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setEsRegistro(false); 
    };

    return (
        <div className="index-background">
            <h1 className="title-1">Crear Cuenta</h1>
            
            <form className="form-index" onSubmit={manejarRegistro}>
                <input 
                    className="input-index"
                    type='text' 
                    placeholder='Nombre completo' 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                />

                <input 
                    className="input-index"
                    type='email' 
                    placeholder='Correo electrónico' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <input 
                    className="input-index"
                    type='password' 
                    placeholder='Contraseña' 
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