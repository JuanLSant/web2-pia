import { useState } from 'react';

// database pruebas
const users = [
    {username: 'admin', email: 'admin@gmail.com', password: '12345'},
    {username: 'user1', email: 'user1@gmail.com', password: '23456'},
    {username: 'user2', email: 'user2@gmail.com', password: '34567'},
    {username: 'user3', email: 'user3@gmail.com', password: '45678'},
]

function Login({setUser}){
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

    return (
        <>
            <h1>Login</h1>
            <form action="" onSubmit={validardatos}>
                <input type='text' placeholder='Username' 
                    value={username} onChange={(e) => setUsername (e.target.value)} 
                    name='username'>
                </input>

                <input type='password' placeholder='Password' 
                    value={password} onChange={(e) => setPassword (e.target.value)} 
                    name='password'>
                </input>

                <button type='submit'>Login</button>
                {error && <p>{errorMessage}</p>}

            </form>
        </>
    )
}

export default Login;