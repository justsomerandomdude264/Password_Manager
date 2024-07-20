// PasswordSave.js
import React from "react";
import "./PasswordSave.css"; 

// PasswordSave component for adding new passwords
const PasswordSave = ({ handleSubmit, inputs, handleInputChange, showPassword, toggleShowPassword }) => {
    return (
        <div className="form-container">
            <h2>Add New Password</h2>
            <div className="form-box">
                <form className="password-add-form" onSubmit={handleSubmit}>
                    {/* Website/Topic input */}
                    <div className="input-container">
                        <input
                            name="website"
                            type="text"
                            placeholder=" "
                            value={inputs.website}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="website">Website/Topic</label>
                    </div>

                    {/* Username/ID input */}
                    <div className="input-container">
                        <input
                            name="username"
                            type="text"
                            placeholder=" "
                            value={inputs.username}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="username">Username/ID</label>
                    </div>

                    {/* Password input with show/hide functionality */}
                    <div className="input-container">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder=" "
                            value={inputs.password}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <button type="button" className="show-password-button" onClick={toggleShowPassword}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Submit button */}
                    <div className="button-container">
                        <button type="submit" className="add-button">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordSave;