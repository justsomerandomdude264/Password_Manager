import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import Popup from 'reactjs-popup';
import PasswordSave from "./PasswordSave";
import "./PasswordDisplay.css";

// Main PasswordDisplay component
const PasswordDisplay = ({ username, handleLogout }) => {
    // State declarations
    const [inputs, setInputs] = useState({ website: '', username: '', password: '' });
    const [passwords, setPasswords] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [masterKey, setMasterKey] = useState('');
    const [showMasterKeyPopup, setShowMasterKeyPopup] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [showChangeMasterKeyPopup, setShowChangeMasterKeyPopup] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newMasterKey, setNewMasterKey] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentMasterKey, setCurrentMasterKey] = useState('');

    const fetchPasswords = useCallback(async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/passwords/${username}`);
          const mappedPasswords = response.data.map(item => ({
            id: item.id,
            website: item.topic,
            username: item.username,
            password: item.encryptedPassword
          }));
          setPasswords(mappedPasswords);
        } catch (error) {
          console.error("Error fetching passwords:", error);
        }
      }, [username]);
    
      useEffect(() => {
        if (!showMasterKeyPopup) {
          fetchPasswords();
        }
      }, [showMasterKeyPopup, fetchPasswords]);

    // Handle input changes for new password entries
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    // Handle submission of new password
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.website && inputs.username && inputs.password) {
            const data = {
                "user": username,
                "username": inputs.username,
                "topic": inputs.website,
                "password": inputs.password,
            }
            try {
                await axios.post('http://localhost:8080/api/add_password', data);
                await fetchPasswords();
                setInputs({ website: '', username: '', password: '' });
            } catch (error) {
                console.error("Error saving password:", error);
            }
        }
    };

    // Toggle password visibility
    const toggleShowPassword = () => setShowPassword(!showPassword);

    // Handle password removal
    const handleRemovePassword = async (index, id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete_password/${id}`);
            await fetchPasswords();
        } catch (error) {
            console.error("Error deleting password:", error);
        }
    };

    // Handle deletion confirmation popup
    const handleButtonClick = (index) => {
        setShowPopup(false);
        setTimeout(() => setShowPopup(index), 500);
    };

    // Handle master key submission
    const handleMasterKeySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/check_master_key', {
                username,
                masterPasskey: masterKey,
            });

            if (response.status === 200) {
                setShowMasterKeyPopup(false);
            }
        } catch (error) {
            setError(error.response ? error.response.data : 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const handleLogoutClick = () => handleLogout();

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const data = {
                "username": username,
                "oldPassword": currentPassword,
                "newPassword": newPassword,
            };
            const response = await axios.post('http://localhost:8080/api/change_password', data);

            if (response.status === 200) {
                setShowChangePasswordPopup(false);
                setCurrentPassword('');
                setNewPassword('');
                alert('Password changed successfully');
            }
        } catch (error) {
            setError('Failed to change password. Please try again.');
        }
    };

    // Handle master key change
    const handleChangeMasterKey = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/change_master_key', {
                username,
                oldMasterKey: currentMasterKey,
                newMasterKey: newMasterKey,
            });

            if (response.status === 200) {
                setShowChangeMasterKeyPopup(false);
                setCurrentMasterKey('');
                setNewMasterKey('');
                alert('Master key changed successfully');
            }
        } catch (error) {
            setError('Failed to change master key. Please try again.');
        }
    };

    // Render component
    return (
        <div className="main-container">
            <h1 className="main-heading">Password Manager</h1>
            
            {/* Logout button */}
            <div className="user-actions">
                <button className="Btn" onClick={handleLogoutClick}>
                    <div className="sign">
                        <svg viewBox="0 0 512 512">
                            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                        </svg>
                    </div>
                    <div className="text">Logout</div>
                </button>
            </div>
            
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
                    {passwords.length > 0 ? (
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
                                                    <button className="confirm-remove-button" onClick={() => { handleRemovePassword(index, pass.id); close(); }}>DELETE</button>
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
                <button className="change-button" onClick={() => setShowChangePasswordPopup(true)}>
                    Change Password
                </button>
                <button className="change-button" onClick={() => setShowChangeMasterKeyPopup(true)}>
                    Change Key
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
                    {error && <p className="error-message">{error}</p>}
                </div>
            </Popup>

            {/* Change Password Popup */}
            <Popup
                open={showChangePasswordPopup}
                modal
                closeOnDocumentClick={false}
                onClose={() => setShowChangePasswordPopup(false)}
            >
                <div className="change-password-popup">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            required
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            required
                        />
                        <button type="submit">Change Password</button>
                    </form>
                    <button onClick={() => setShowChangePasswordPopup(false)}>Cancel</button>
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
        </div>
    );
};

export default PasswordDisplay;