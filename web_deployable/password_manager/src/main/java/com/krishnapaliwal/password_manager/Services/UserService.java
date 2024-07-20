package com.krishnapaliwal.password_manager.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Exceptions.UserNotFoundException;
import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;
import com.krishnapaliwal.password_manager.Respositories.PasswordRepository;
import com.krishnapaliwal.password_manager.Respositories.UserRepository;

/**
 * Service class for managing user-related operations.
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private PasswordService passwordService;

    /**
     * Adds a new user to the system.
     * @param username The username for the new user
     * @param password The password for the new user
     * @param email The email for the new user
     * @param masterPasskey The master passkey for the new user
     * @return The newly created User object
     * @throws Exception if there's an error during user creation
     */
    public User addUser(String username, String password, String email, String masterPasskey) throws Exception {
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setMasterPasskey(encryptionService.sha256encryption(masterPasskey));
        newUser.setAccPasswordHash(encryptionService.sha256encryption(password));

        return userRepository.save(newUser);
    }

    /**
     * Retrieves a user by their username.
     * @param username The username to search for
     * @return The User object if found
     * @throws UserNotFoundException if the user is not found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Retrieves a user by their email.
     * @param email The email to search for
     * @return The User object if found
     * @throws UserNotFoundException if the user is not found
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    /**
     * Changes the password for a user.
     * @param username The username of the user
     * @param oldPassword The current password
     * @param newPassword The new password to set
     * @return A string indicating the result of the operation
     */
    public String changePassword(String username, String oldPassword, String newPassword) {
        try {
            User user = getUserByUsername(username);
            if (!encryptionService.sha256encryption(oldPassword).equals(user.getAccPasswordHash())) {
                return "Old password is incorrect";
            }
            
            user.setAccPasswordHash(encryptionService.sha256encryption(newPassword));
            userRepository.save(user);
            return "Password changed successfully";
        } catch (UserNotFoundException e) {
            return "User not found";
        } catch (Exception e) {
            return "Error changing password: " + e.getMessage();
        }
    }

    /**
     * Changes the master key for a user and re-encrypts all their passwords.
     * @param username The username of the user
     * @param oldMasterKey The current master key
     * @param newMasterKey The new master key to set
     * @return A string indicating the result of the operation
     */
    public String changeMasterKey(String username, String oldMasterKey, String newMasterKey) {
        try {    
            User user = getUserByUsername(username);
            if (!encryptionService.sha256encryption(oldMasterKey).equals(user.getMasterPasskey())) {
                return "Old master key is incorrect";
            }
    
            List<Password> decryptedPasswords = passwordService.getDecryptedPasswords(user);
            for (Password decryptedPassword : decryptedPasswords) {
                try {
                    String reEncryptedPassword = encryptionService.encrypt(decryptedPassword.getEncryptedPassword(), 
                                                                           encryptionService.sha256encryption(newMasterKey));
                    decryptedPassword.setEncryptedPassword(reEncryptedPassword);
                    passwordRepository.save(decryptedPassword);
                } catch (Exception e) {
                    System.err.println("Error processing password for " + decryptedPassword.getTopic() + ": " + e.getMessage());
                }
            }
            
            user.setMasterPasskey(encryptionService.sha256encryption(newMasterKey));
            userRepository.save(user);
    
            return "Master key changed successfully";
        } catch (UserNotFoundException e) {
            return "User not found";
        } catch (Exception e) {
            return "Error changing master key: " + e.getMessage();
        }
    }
}