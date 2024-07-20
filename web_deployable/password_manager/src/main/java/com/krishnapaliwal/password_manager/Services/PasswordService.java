package com.krishnapaliwal.password_manager.Services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;
import com.krishnapaliwal.password_manager.Respositories.PasswordRepository;

/**
 * Service class for managing password-related operations.
 */
@Service
public class PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private EncryptionService encryptionService;

    /**
     * Adds a new password entry for a user.
     * @param user The user who owns the password
     * @param website The website or application for the password
     * @param username The username for the password entry
     * @param password The actual password to be encrypted and stored
     * @return The newly created Password object
     * @throws Exception if there's an error during password creation or encryption
     */
    public Password addPassword(User user, String website, String username, String password) throws Exception {
        String encryptedPassword = encryptionService.encrypt(password, user.getMasterPasskey());

        Password newPassword = new Password();
        newPassword.setUser(user);
        newPassword.setTopic(website);
        newPassword.setUsername(username);
        newPassword.setEncryptedPassword(encryptedPassword);

        return passwordRepository.save(newPassword);
    }

    /**
     * Deletes a password entry by its ID.
     * @param id The ID of the password entry to delete
     */
    public void deletePasswordById(Long id) {
        passwordRepository.deleteById(id);
    }

    /**
     * Retrieves and decrypts all passwords for a given user.
     * @param user The user whose passwords to retrieve and decrypt
     * @return A list of decrypted Password objects
     * @throws IllegalArgumentException if the user or master passkey is null
     */
    public List<Password> getDecryptedPasswords(User user) {
        if (user == null || user.getMasterPasskey() == null) {
            throw new IllegalArgumentException("User or master passkey is null");
        }

        List<Password> encryptedPasswords = passwordRepository.findByUser(user);

        return encryptedPasswords.stream()
                .map(p -> decryptPassword(p, user.getMasterPasskey()))
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }

    /**
     * Decrypts a single password entry.
     * @param encryptedPassword The Password object containing the encrypted password
     * @param masterPasskey The master passkey used for decryption
     * @return A new Password object with the decrypted password, or null if decryption fails
     */
    public Password decryptPassword(Password encryptedPassword, String masterPasskey) {
        try {
            String decryptedPasswordString = encryptionService.decrypt(
                    encryptedPassword.getEncryptedPassword(),
                    masterPasskey
            );

            Password decryptedPassword = new Password();
            decryptedPassword.setId(encryptedPassword.getId());
            decryptedPassword.setUser(encryptedPassword.getUser());
            decryptedPassword.setTopic(encryptedPassword.getTopic());
            decryptedPassword.setUsername(encryptedPassword.getUsername());
            decryptedPassword.setEncryptedPassword(decryptedPasswordString);

            return decryptedPassword;
        } catch (RuntimeException e) {
            System.err.println("Error decrypting password for " + encryptedPassword.getTopic() + ": " + e.getMessage());
            return null;
        }
    }
}