import { useState } from 'react';


function Login({setUser, setEsRegistro}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState ("");

    const validardatos = async (e) => {
        e.preventDefault();
        if ( username==="" || password==="" ) {
            setError(true);
            setErrorMessage("Los campos se encuentran vacios");
            return;
        }
        try {
           // cnexión con el servidor de node.js
           const response = await fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        const data = await response.json();

        if (data === "Success") {
           setError(false);
           setUser(username); 
        } else {
           setError(true);
           setErrorMessage(data.alerta || "Error en credenciales");
        }
      } catch (err) {
        setError(true);
        setErrorMessage("No se pudo conectar con el servidor");
      }
    };

    return  (
        <div className="index-background">
            <h1 className="title-1">Login</h1>
            <form className="form-index" onSubmit={validardatos}>
                <input 
                    className="input-index"
                    type='text' 
                    placeholder='Username' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    name='username'
                />

                <input 
                    className="input-index"
                    type='password' 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    name='password'
                />

                <button className="button-index" type='submit'>
                    Ingresar
                </button>

                {error && <p className="error-message">{errorMessage}</p>}

                <span className='auth-link' onClick={() => setEsRegistro(true)}>
                Registrarse
                </span>
            </form>
        </div>
    )
    
}

export default Login;