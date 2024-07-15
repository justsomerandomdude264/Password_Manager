import React, { useState } from "react";
import axios from 'axios';
import "./AuthPage.css";

const LoginPage = ({ onSwitchToRegister, onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        try {
            const response = await axios.post("http://localhost:8080/api/login", { username, password });
            console.log("Login successful:", response.data);
            onLoginSuccess({ username });
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setErrorMessage("Username not found");
                        break;
                    case 401:
                        setErrorMessage("Invalid credentials");
                        break;
                    default:
                        setErrorMessage("An error occurred");
                }
            } else {
                setErrorMessage("An error occurred: " + error.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1 className="heading">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <input
                            name="username"
                            type="text"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-container">
                        <input
                            name="password"
                            type="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <p className="switch-text">
                    Don't have an account? <span onClick={onSwitchToRegister}>Register</span>
                </p>
            </div>
        </div>
    );
};

const RegisterPage = ({ onSwitchToLogin }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [masterPasskey, setMasterPasskey] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        try {
            const response = await axios.post("http://localhost:8080/api/register", {
                username,
                email,
                password,
                masterPasskey,
            });
            console.log("Register successful:", response.data);
            onSwitchToLogin();
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setErrorMessage(error.response.data);
                        break;
                    case 500:
                        setErrorMessage("An error occurred");
                        break;
                    default:
                        setErrorMessage("An error occurred");
                }
            } else {
                setErrorMessage("An error occurred: " + error.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1 className="heading">Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="input-container">
                        <input
                            name="username"
                            type="text"
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="input-container">
                        <input
                            name="email"
                            type="email"
                            placeholder=" "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-container">
                        <input
                            name="password"
                            type="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-container">
                        <input
                            name="masterPasskey"
                            type="password"
                            placeholder=" "
                            value={masterPasskey}
                            onChange={(e) => setMasterPasskey(e.target.value)}
                            required
                        />
                        <label htmlFor="masterPasskey">Master Passkey</label>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="switch-text">
                    Already have an account? <span onClick={onSwitchToLogin}>Login</span>
                </p>
            </div>
        </div>
    );
};

const AuthPages = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            {isLogin ? (
                <LoginPage onSwitchToRegister={() => setIsLogin(false)} onLoginSuccess={onLoginSuccess} />
            ) : (
                <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </>
    );
};

export default AuthPages;