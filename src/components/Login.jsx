import { useState } from 'react';

// database pruebas
const users = [
    {username: 'admin', email: 'admin@gmail.com', password: '12345'},
    {username: 'user1', email: 'user1@gmail.com', password: '23456'},
    {username: 'user2', email: 'user2@gmail.com', password: '34567'},
    {username: 'user3', email: 'user3@gmail.com', password: '45678'},
]

function Login({setUser, setEsRegistro}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState ("");

    const validardatos = (e) => {
        e.preventDefault();
        if ( username==="" || password==="" ) {
            setError(true);
            setErrorMessage("Los campos se encuentran vacios");
            return;
        }

        //db -- busca usuario
        const user = users.find(
            (u) => u.username === username && u.password === password
        );

        /// usuario activo

        if (user) {
            setError(false);
            setUser(username);
        }
        /// usuario inactivo
        else {
            setError(true);
            setErrorMessage ("Error en credenciales");
        }

        // limpiar
        setUsername("");
        setPassword("");
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