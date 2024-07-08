// PasswordDisplay.js
import React, { useState } from "react";
import Popup from 'reactjs-popup';
import PasswordSave from "./PasswordSave";
import "./PasswordDisplay.css";

const PasswordDisplay = () => {
    const [inputs, setInputs] = useState({
        website: '',
        username: '',
        password: ''
    });
    const [passwords, setPasswords] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputs.website && inputs.username && inputs.password) {
            setPasswords(prevPasswords => [...prevPasswords, inputs]);
            setInputs({ website: '', username: '', password: '' });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleRemovePassword = (index) => {
        setPasswords(prevPasswords => prevPasswords.filter((_, i) => i !== index));
    }

    const handleButtonClick = (index) => {
        setShowPopup(false);
        setTimeout(() => setShowPopup(index), 500); // 500ms delay for animation to complete
    }

    return (
        <div className="main-container">
            <h1 className="main-heading">Password Manager</h1>
            <div className="content-container">
                <PasswordSave 
                    handleSubmit={handleSubmit}
                    inputs={inputs}
                    handleInputChange={handleInputChange}
                    showPassword={showPassword}
                    toggleShowPassword={toggleShowPassword}
                />
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
                                            color: "#fff",
                                            padding: "20px",
                                            borderRadius: "8px",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            fontSize: "14px"
                                        }}
                                    >
                                        {close => (
                                            <div className="popup-content">
                                                <h3 className="popup-text">Are You SURE?</h3>
                                                <button className="confirm-remove-button" onClick={() => { handleRemovePassword(index); close(); }}>DELETE</button>
                                                <button className="unconfirm-remove-button" onClick={close}>CANCEL</button>
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
        </div>
    );
};

export default PasswordDisplay;