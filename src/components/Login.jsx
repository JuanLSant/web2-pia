import { useState, useEffect } from 'react';
import userRoundIcon from '../assets/user-round.svg';
import lockIcon from '../assets/lock.svg';
import atSignIcon from '../assets/at-sign.svg';

function Login({ setUser, setEsRegistro }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Estados adicionales para recordar usuario y recuperación
    const [rememberMe, setRememberMe] = useState(false);
    const [view, setView] = useState("login"); // 'login' | 'forgot' | 'reset'
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Cargar usuario recordado al montar
    useEffect(() => {
        const savedUsername = localStorage.getItem('remembered_username');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (!username.trim() || view !== "login") {
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
    }, [username, view]);

    const validardatos = async (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setError(true);
            setErrorMessage("Los campos se encuentran vacíos");
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
                
                // Guardar o borrar usuario en localStorage según el checkbox
                if (rememberMe) {
                    localStorage.setItem('remembered_username', username);
                } else {
                    localStorage.removeItem('remembered_username');
                }

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

    const manejarRecuperar = async (e) => {
        e.preventDefault();
        if (!recoveryEmail.trim()) {
            setError(true);
            setErrorMessage("Por favor ingresa tu correo electrónico");
            return;
        }
        try {
            const response = await fetch('http://localhost:8081/recuperar-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail })
            });
            const data = await response.json();
            if (response.ok) {
                setError(false);
                setSuccessMessage(data.message);
                setView("reset");
            } else {
                setError(true);
                setErrorMessage(data.error || "Ocurrió un error al solicitar el código");
            }
        } catch (err) {
            setError(true);
            setErrorMessage("No se pudo conectar con el servidor");
        }
    };

    const manejarRestablecer = async (e) => {
        e.preventDefault();
        if (!verificationCode.trim() || !newPassword.trim()) {
            setError(true);
            setErrorMessage("Por favor completa todos los campos");
            return;
        }
        try {
            const response = await fetch('http://localhost:8081/restablecer-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: recoveryEmail,
                    codigo: verificationCode,
                    nuevoPassword: newPassword
                })
            });
            const data = await response.json();
            if (response.ok) {
                setError(false);
                setSuccessMessage("¡Contraseña restablecida con éxito!");
                setTimeout(() => {
                    setView("login");
                    setVerificationCode("");
                    setNewPassword("");
                    setSuccessMessage("");
                    setRecoveryEmail("");
                }, 2500);
            } else {
                setError(true);
                setErrorMessage(data.error || "Código incorrecto o expirado");
            }
        } catch (err) {
            setError(true);
            setErrorMessage("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="login-wrap">
            <div className="login-card">
                {view === "login" && (
                    <>
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

                            <div className="login-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Recordar usuario</span>
                                </label>
                                <span 
                                    className="forgot-password-link" 
                                    onClick={() => { 
                                        setView("forgot"); 
                                        setError(false); 
                                        setErrorMessage(""); 
                                        setSuccessMessage(""); 
                                    }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </span>
                            </div>

                            <button className="login-btn" type="submit">Ingresar</button>

                            {error && <p className="error-message">{errorMessage}</p>}
                            {successMessage && <p className="success-message">{successMessage}</p>}
                        </form>
                    </>
                )}

                {view === "forgot" && (
                    <>
                        <div className="login-logo">
                            <img className="login-logo-icon" src={atSignIcon} alt="Email" />
                        </div>
                        <h1 className="login-title">¿Olvidaste tu contraseña?</h1>
                        <p className="login-subtitle">Ingresa tu correo para recibir un código de verificación</p>

                        <form onSubmit={manejarRecuperar}>
                            <div className="field-wrap">
                                <img className="field-icon" src={atSignIcon} alt="Email" />
                                <input
                                    className="login-input"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    name="email"
                                    required
                                />
                            </div>

                            <button className="login-btn" type="submit">Enviar código</button>

                            {error && <p className="error-message">{errorMessage}</p>}

                            <p className="register-row">
                                <span className="register-link" onClick={() => { setView("login"); setError(false); setErrorMessage(""); }}>
                                    Volver al inicio de sesión
                                </span>
                            </p>
                        </form>
                    </>
                )}

                {view === "reset" && (
                    <>
                        <div className="login-logo">
                            <img className="login-logo-icon" src={lockIcon} alt="Lock" />
                        </div>
                        <h1 className="login-title">Restablecer contraseña</h1>
                        <p className="login-subtitle">Ingresa el código enviado a tu correo y tu nueva contraseña</p>

                        <form onSubmit={manejarRestablecer}>
                            {successMessage && <p className="success-message-info">{successMessage}</p>}

                            <div className="field-wrap">
                                <img className="field-icon" src={userRoundIcon} alt="Code" />
                                <input
                                    className="login-input"
                                    type="text"
                                    placeholder="Código de 6 dígitos"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <div className="field-wrap">
                                <img className="field-icon" src={lockIcon} alt="Lock" />
                                <input
                                    className="login-input"
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="login-btn" type="submit">Restablecer contraseña</button>

                            {error && <p className="error-message">{errorMessage}</p>}
                            {successMessage && !successMessage.includes("código") && <p className="success-message">{successMessage}</p>}

                            <p className="register-row">
                                <span 
                                    className="register-link" 
                                    onClick={() => { 
                                        setView("login"); 
                                        setError(false); 
                                        setErrorMessage(""); 
                                        setSuccessMessage(""); 
                                        setRecoveryEmail(""); 
                                        setVerificationCode("");
                                        setNewPassword("");
                                    }}
                                >
                                    Cancelar y volver
                                </span>
                            </p>
                        </form>
                    </>
                )}

                {view === "login" && (
                    <p className="register-row">
                        ¿No tienes cuenta?
                        <span className="register-link" onClick={() => setEsRegistro(true)}>
                            Registrarse
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;