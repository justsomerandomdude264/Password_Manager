package com.krishnapaliwal.password_manager.Services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;
import com.krishnapaliwal.password_manager.Respositories.PasswordRepository;

@Service
public class PasswordService {

    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private EncryptionService encryptionService;

    public Password addPassword(User user, String website, String username, String password) throws Exception {
        String encryptedPassword = encryptionService.encrypt(password, user.getMasterPasskey());

        Password newPassword = new Password();
        newPassword.setUser(user);
        newPassword.setTopic(website);
        newPassword.setUsername(username);
        newPassword.setEncryptedPassword(encryptedPassword);

        return passwordRepository.save(newPassword);
    }

    public void deletePasswordById(Long id) {
        passwordRepository.deleteById(id);
    }

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

    private Password decryptPassword(Password encryptedPassword, String masterPasskey) {
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
            return null;
        }
    }
}