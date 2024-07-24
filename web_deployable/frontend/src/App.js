import React, { useState, useEffect } from 'react';
import AuthPages from './AuthPage';
import PasswordDisplay from './PasswordDisplay';

// Main App component
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);

    // Check for stored username on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername || (storedUsername == "null")) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        }
    }, []);

    // Handle successful login
    const handleLoginSuccess = ({ username }) => {
        setIsAuthenticated(true);
        setUsername(username);
        localStorage.setItem('username', username);
    };

    // Handle logout
    const handleLogout = () => {
        setUsername(null);
        setIsAuthenticated(false);
        localStorage.removeItem('username');
    };

    // Render either PasswordDisplay or AuthPages based on authentication status
    return (
        <div className="App">
            {isAuthenticated ? (
                <PasswordDisplay username={username} handleLogout={handleLogout} />
            ) : (
                <AuthPages onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;