import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logged in with", { username, password });
    };

    return (
        <div className="prime-container">
            <div className="login">
                <form>
                    <h1 className="heading">Login</h1>
                    <div>
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
                        <div className="button-container">
                            <button type="submit" className="add-button" onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;