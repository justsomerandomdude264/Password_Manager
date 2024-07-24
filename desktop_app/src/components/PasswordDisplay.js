import React, { useState, useEffect, useCallback } from "react";
import Popup from 'reactjs-popup';
import PasswordSave from "./PasswordSave";
import "./PasswordDisplay.css";
import store from "./storeUtil";

const PasswordDisplay = () => {
    // State declarations
    const [inputs, setInputs] = useState({ website: '', username: '', password: '' });
    const [passwords, setPasswords] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [masterKey, setMasterKey] = useState('');
    const [showMasterKeyPopup, setShowMasterKeyPopup] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChangeMasterKeyPopup, setShowChangeMasterKeyPopup] = useState(false);
    const [showSetMasterKeyPopup, setShowSetMasterKeyPopup] = useState(false);
    const [favouriteColor, setFavouriteColor] = useState('');
    const [nickname, setNickname] = useState('');
    const [masterKeySet, setMasterKeySet] = useState('');
    const [newMasterKey, setNewMasterKey] = useState('');
    const [currentMasterKey, setCurrentMasterKey] = useState('');
    const [showForgotMasterKeyPopup, setShowForgotMasterKeyPopup] = useState(false);
    const [forgotNickname, setForgotNickname] = useState('');
    const [forgotFavoriteColor, setForgotFavoriteColor] = useState('');
    const [showChangeCredentialsPopup, setShowChangeCredentialsPopup] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [newFavoriteColor, setNewFavoriteColor] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    // Method to obtain passwords from local storage 
    const fetchPasswords = useCallback(() => {
        const storedPasswords = JSON.parse(localStorage.getItem('passwords') || '[]');
        setPasswords(storedPasswords);
    }, []);
    
    // useEffects to check if the masterkey is strored or not and also to fetch passwords
    useEffect(() => {
        const storedMasterKey = localStorage.getItem('masterKey');
        if (!storedMasterKey || storedMasterKey === "null") {
            setShowSetMasterKeyPopup(true);
        } else {
            setShowMasterKeyPopup(true);
        }
    }, []);
    
    useEffect(() => {
        if (!showMasterKeyPopup && !showSetMasterKeyPopup) {
            fetchPasswords();
        }
    }, [showMasterKeyPopup, showSetMasterKeyPopup, fetchPasswords]);

    // Functions to handle hover in tooltip
    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => setShowTooltip(false);

    // Handle input change for inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    // Handle add passwords button
    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputs.website && inputs.username && inputs.password) {
            const newPassword = {
                id: Date.now(),
                website: inputs.website,
                username: inputs.username,
                password: inputs.password,
            };
            const updatedPasswords = [...passwords, newPassword];
            localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
            setPasswords(updatedPasswords);
            setInputs({ website: '', username: '', password: '' });
        }
    };

    // Function to toggle show passoword in save/add password form
    const toggleShowPassword = () => setShowPassword(!showPassword);

    // Method to remove a password using its id
    const handleRemovePassword = (id) => {
        const updatedPasswords = passwords.filter(pass => pass.id !== id);
        localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
        setPasswords(updatedPasswords);
        fetchPasswords();
    };

    // handle button click for the part where paswords are displayed
    const handleButtonClick = (index) => {
        setShowPopup(false);
        setTimeout(() => setShowPopup(index), 500);
    };

    // Method to handle when the user forgets his master key (in the forgot master key popup)
    const handleForgotMasterKey = (e) => {
        e.preventDefault();
        const storedNickname = localStorage.getItem('nickname');
        const storedFavoriteColor = localStorage.getItem('fav-color');
        const storedMasterKey = localStorage.getItem('masterKey');
    
        if (forgotNickname === storedNickname && forgotFavoriteColor === storedFavoriteColor) {
            alert(`Your master key is: ${storedMasterKey}`);
            setShowForgotMasterKeyPopup(false);
            setShowMasterKeyPopup(true);
        } else {
            setError('Incorrect information. Please try again.');
        }
        setForgotNickname('');
        setForgotFavoriteColor('');
    };

    // Function to set the first master key with other credentials
    const handleSetMasterKey = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        localStorage.setItem('masterKey', masterKeySet); 
        localStorage.setItem('fav-color', favouriteColor);
        localStorage.setItem('nickname', nickname);
        setIsLoading(false);
        setShowSetMasterKeyPopup(false);
        setShowMasterKeyPopup(true);
    };  

    // Method to check if the master key is valid (in the begginning of the program)
    const handleMasterKeySubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const storedMasterKey = localStorage.getItem('masterKey');
        if (masterKey === storedMasterKey) {
            setShowMasterKeyPopup(false);
        } else {
            setError('Incorrect master key. Please try again.');
        }
        setMasterKey('');
        setIsLoading(false);
    };

    // method to change master key by validating the master key
    const handleChangeMasterKey = (e) => {
        e.preventDefault();
        const storedMasterKey = localStorage.getItem('masterKey');
        if (currentMasterKey === storedMasterKey) {
            localStorage.setItem('masterKey', newMasterKey);
            setShowChangeMasterKeyPopup(false);
            setCurrentMasterKey('');
            setNewMasterKey('');
            alert('Master key changed successfully');
        } else {
            setError('Current master key is incorrect. Please try again.');
        }
    };

    // Method to change credentials by validating the master key
    const handleChangeCredentials = (e) => {
        e.preventDefault();
        const storedMasterKey = localStorage.getItem('masterKey');
        if (currentMasterKey === storedMasterKey) {
            localStorage.setItem('nickname', newNickname);
            localStorage.setItem('fav-color', newFavoriteColor);
            setShowChangeCredentialsPopup(false);
            setCurrentMasterKey('');
            setNewNickname('');
            setNewFavoriteColor('');
            alert('Credentials changed successfully');
        } else {
            setError('Current master key is incorrect. Please try again.');
        }
    };

    // Render component
    return (
        <div className="main-container">
            <h1 className="main-heading">
                Password Manager
                <div className="icon-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <svg className="info-icon" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    {showTooltip && <div className="tooltip">Important: Passwords are not encrypted. If you lose your credentials and passkey then the data becomes unaccesible. USE AT YOUR OWN RISK</div>}
                </div>
            </h1>

            <div className="content-container">
                {/* Password save form */}
                <PasswordSave
                    handleSubmit={handleSubmit}
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                />
                
                {/* Display saved passwords */}
                <div className="display-container">
                    <h2>Saved Passwords</h2>
                    {passwords.length > 0 && !showMasterKeyPopup && !showForgotMasterKeyPopup? (
                        <ul className="password-list">
                            {passwords.map((pass, index) => (
                                <li key={index} className="password-item">
                                    <strong>{pass.website}</strong>
                                    <div><p>Username: </p><h4>{pass.username}</h4></div>
                                    <div><p>Password: </p><h4>{pass.password}</h4></div>
                                    <Popup
                                        trigger={<button className="button" onClick={() => handleButtonClick(index)}>
                                            <svg viewBox="0 0 448 512" className="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                                        </button>}
                                        modal
                                        nested
                                        open={showPopup === index}
                                        contentStyle={{
                                            backgroundColor: "#2c2c2c",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                        }}
                                        >
                                            {close => (
                                                <div className="popup-content">
                                                <h3 className="popup-text">Are You SURE?</h3>
                                                <div className="popup-buttons">
                                                    <button className="confirm-remove-button" onClick={() => { handleRemovePassword(pass.id); close(); }}>DELETE</button>
                                                    <button className="unconfirm-remove-button" onClick={close}>CANCEL</button>
                                                </div>
                                                </div>
                                            )}
                                        </Popup>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No passwords saved yet.</p>
                    )}
                </div>
            </div>
            
            {/* Bottom action buttons */}
            <div className="bottom-actions">
                <button className="change-button" onClick={() => setShowChangeMasterKeyPopup(true)}>
                    Change Key
                </button>
                <button className="change-button" onClick={() => setShowChangeCredentialsPopup(true)}>
                    Change Credentials
                </button>
            </div>

            {/* Popups */}
            {/* Master Key Popup */}
            <Popup
                open={showMasterKeyPopup}
                modal
                closeOnDocumentClick={false}
                contentStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                }}
            >
                <div className="master-key-popup">
                    <h3>Enter Master Key</h3>
                    <form onSubmit={handleMasterKeySubmit}>
                        <input
                            type="password"
                            value={masterKey}
                            onChange={(e) => setMasterKey(e.target.value)}
                            placeholder="Master Key"
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    <button onClick={() => {
                        setShowMasterKeyPopup(false);
                        setShowForgotMasterKeyPopup(true);
                    }}>
                        Forgot Master Key
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </Popup>

            {/* Set Master Key Popup */}
            <Popup
                open={showSetMasterKeyPopup}
                modal
                closeOnDocumentClick={false}
                contentStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                }}
            >
                <div className="set-master-key-popup">
                    <h3>Set Master Key</h3>
                    <form onSubmit={handleSetMasterKey}>
                        <input
                            type="password"
                            value={masterKeySet}
                            onChange={(e) => setMasterKeySet(e.target.value)}
                            placeholder="Master Key"
                            required
                        />
                        <input
                            type="text"
                            className="fav-color"
                            value={favouriteColor}
                            onChange={(e) => setFavouriteColor(e.target.value)}
                            placeholder="Favourite Color?"
                            required
                        />
                        <input
                            type="text"
                            className="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Nickname?"
                            required
                        />
                        <button type="submit" disabled={isLoading} onClick={handleSetMasterKey}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </Popup>

            {/* Change Master Key Popup */}
            <Popup
                open={showChangeMasterKeyPopup}
                modal
                closeOnDocumentClick={false}
                onClose={() => setShowChangeMasterKeyPopup(false)}
            >
                <div className="change-master-key-popup">
                    <h3>Change Master Key</h3>
                    <form onSubmit={handleChangeMasterKey}>
                        <input
                            type="password"
                            value={currentMasterKey}
                            onChange={(e) => setCurrentMasterKey(e.target.value)}
                            placeholder="Current Master Key"
                            required
                        />
                        <input
                            type="password"
                            value={newMasterKey}
                            onChange={(e) => setNewMasterKey(e.target.value)}
                            placeholder="New Master Key"
                            required
                        />
                        <button type="submit">Change Master Key</button>
                    </form>
                    <button onClick={() => setShowChangeMasterKeyPopup(false)}>Cancel</button>
                </div>
            </Popup>

            {/* Forgot Master Key Popup */}
            <Popup
                open={showForgotMasterKeyPopup}
                modal
                closeOnDocumentClick={false}
                contentStyle={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                }}
            >
                <div className="forgot-master-key-popup">
                    <h3>Recover Master Key</h3>
                    <form onSubmit={handleForgotMasterKey}>
                        <input
                            type="text"
                            value={forgotNickname}
                            onChange={(e) => setForgotNickname(e.target.value)}
                            placeholder="Nickname"
                            required
                        />
                        <input
                            type="text"
                            value={forgotFavoriteColor}
                            onChange={(e) => setForgotFavoriteColor(e.target.value)}
                            placeholder="Favorite Color"
                            required
                        />
                        <button type="submit">Recover Master Key</button>
                    </form>
                    <button onClick={() => {
                        setShowForgotMasterKeyPopup(false);
                        setShowMasterKeyPopup(true);
                    }}>
                        Back to Master Key Input
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </Popup>

            {/* Change Credentials Popup */}
            <Popup
                open={showChangeCredentialsPopup}
                modal
                closeOnDocumentClick={false}
                onClose={() => setShowChangeCredentialsPopup(false)}
            >
                <div className="change-credentials-popup">
                    <h3>Change Credentials</h3>
                    <form onSubmit={handleChangeCredentials}>
                        <input
                            type="password"
                            value={currentMasterKey}
                            onChange={(e) => setCurrentMasterKey(e.target.value)}
                            placeholder="Current Master Key"
                            required
                        />
                        <input
                            type="text"
                            value={newNickname}
                            onChange={(e) => setNewNickname(e.target.value)}
                            placeholder="New Nickname"
                            required
                        />
                        <input
                            type="text"
                            value={newFavoriteColor}
                            onChange={(e) => setNewFavoriteColor(e.target.value)}
                            placeholder="New Favorite Color"
                            required
                        />
                        <button type="submit">Change Credentials</button>
                    </form>
                    <button onClick={() => setShowChangeCredentialsPopup(false)}>Cancel</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </Popup>
        </div>
    );
};

export default PasswordDisplay;