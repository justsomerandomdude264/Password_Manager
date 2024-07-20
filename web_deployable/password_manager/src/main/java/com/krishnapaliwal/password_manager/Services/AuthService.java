package com.krishnapaliwal.password_manager.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Exceptions.UserNotFoundException;
import com.krishnapaliwal.password_manager.Models.User;

/**
 * Service class for handling authentication-related operations.
 */
@Service
public class AuthService {

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private UserService userService;

    /**
     * Authenticates a user login attempt.
     * @param username The username of the user trying to log in
     * @param password The password provided for authentication
     * @return A string indicating the result of the login attempt
     */
    public String authLogin(String username, String password) {
        try {
            User user = userService.getUserByUsername(username);
            String encryptedPassword = encryptionService.sha256encryption(password);

            if (user.getAccPasswordHash().equals(encryptedPassword)) {
                return "Successful";
            } else {
                return "Password is incorrect";
            }
        } catch (UserNotFoundException e) {
            return "Username does not exist";
        }
    }

    /**
     * Registers a new user.
     * @param username The desired username for the new user
     * @param password The password for the new user
     * @param email The email address of the new user
     * @param masterPasskey The master passkey for the new user
     * @return A string indicating the result of the registration attempt
     */
    public String authRegister(String username, String password, String email, String masterPasskey) {
        if (isUserExistsByUsername(username)) {
            return "Username already exists.";
        }

        if (isUserExistsByEmail(email)) {
            return "Email already used.";
        }

        try {
            userService.addUser(username, password, email, masterPasskey);
            return "Successful";
        } catch (Exception e) {
            return "Unknown error occurred during registration";
        }
    }

    /**
     * Checks if the provided master key is correct for the given user.
     * @param username The username of the user
     * @param masterPasskey The master passkey to check
     * @return A string indicating whether the check was successful or not
     */
    public String checkMasterKey(String username, String masterPasskey) {
        try {
            User user = userService.getUserByUsername(username);
            String encryptedMasterKey = encryptionService.sha256encryption(masterPasskey);

            return user.getMasterPasskey().equals(encryptedMasterKey) ? "Successful" : "Failure";
        } catch (UserNotFoundException e) {
            return "Invalid username";
        }
    }

    /**
     * Helper method to check if a user exists by username.
     */
    private boolean isUserExistsByUsername(String username) {
        try {
            userService.getUserByUsername(username);
            return true;
        } catch (UserNotFoundException e) {
            return false;
        }
    }

    /**
     * Helper method to check if a user exists by email.
     */
    private boolean isUserExistsByEmail(String email) {
        try {
            userService.getUserByEmail(email);
            return true;
        } catch (UserNotFoundException e) {
            return false;
        }
    }
}