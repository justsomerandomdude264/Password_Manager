package com.krishnapaliwal.password_manager.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Exceptions.UserNotFoundException;
import com.krishnapaliwal.password_manager.Models.User;
import com.krishnapaliwal.password_manager.Respositories.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EncryptionService encryptionService;

    public User addUser(String username, String password, String email,String masterPasskey) throws Exception {

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setMasterPasskey(encryptionService.sha256encryption(masterPasskey));
        newUser.setAccPasswordHash(encryptionService.sha256encryption(password));

        return userRepository.save(newUser);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

}
