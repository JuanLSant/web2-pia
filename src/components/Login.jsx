import { useState, useEffect } from 'react';
import userRoundIcon from '../assets/user-round.svg';
import lockIcon from '../assets/lock.svg';

function Login({ setUser, setEsRegistro }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (!username.trim()) {
            setAvatarUrl(null);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:8081/usuario-avatar/${encodeURIComponent(username.trim())}`);
                const data = await response.json();
                if (data.success && data.imagen_url) {
                    setAvatarUrl(`http://localhost:8081/${data.imagen_url}`);
                } else {
                    setAvatarUrl(null);
                }
            } catch (err) {
                console.error("Error fetching avatar:", err);
                setAvatarUrl(null);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [username]);

    const validardatos = async (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setError(true);
            setErrorMessage("Los campos se encuentran vacios");
            return;
        }
        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data.success) {
                setError(false);
                console.log("Datos usuario:", data.usuario);
                setUser(data.usuario);
            } else {
                setError(true);
                setErrorMessage(data.alerta || "Error en credenciales");
            }

        } catch (err) {
            console.log("Error catch:", err);
            setError(true);
            setErrorMessage("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="login-wrap">


            <div className="login-card">
                {avatarUrl ? (
                    <div className="login-logo-avatar">
                        <img src={avatarUrl} alt="Avatar" />
                    </div>
                ) : (
                    <div className="login-logo">
                        <img className="login-logo-icon" src={userRoundIcon} alt="Logo" />
                    </div>
                )}
                <h1 className="login-title">Bienvenido de vuelta</h1>
                <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

                <form onSubmit={validardatos}>
                    <div className="field-wrap">
                        <img className="field-icon" src={userRoundIcon} alt="User" />
                        <input
                            className="login-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            name="username"
                            autoComplete="username"
                        />
                    </div>

                    <div className="field-wrap">
                        <img className="field-icon" src={lockIcon} alt="Lock" />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button className="login-btn" type="submit">Ingresar</button>

                    {error && <p className="error-message">{errorMessage}</p>}
                </form>

                <p className="register-row">
                    ¿No tienes cuenta?
                    <span className="register-link" onClick={() => setEsRegistro(true)}>
                        Registrarse
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;