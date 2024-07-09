import React, { useState } from "react";
import "./AuthPage.css";

const LoginPage = ({ onSwitchToRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logged in with", { username, password });
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

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Registered with", { username, email, password });
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
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="switch-text">
                    Already have an account? <span onClick={onSwitchToLogin}>Login</span>
                </p>
            </div>
        </div>
    );
};

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            {isLogin ? (
                <LoginPage onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </>
    );
};

export default AuthPages;