package com.krishnapaliwal.password_manager.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.krishnapaliwal.password_manager.Exceptions.UserNotFoundException;
import com.krishnapaliwal.password_manager.Models.User;

@Service
public class AuthService {
    
    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private UserService userService;


    public String AuthLogin(String username, String password) {
        User user;

        try {
            user = userService.getUserByUsername(username);
        } catch (UserNotFoundException e) {
            return "Username does not exist";
        }
       
        String encryptedPassword = encryptionService.sha256encryption(password);

        if (user.getAccPasswordHash().equals(encryptedPassword)) {
            return "Successful";
        } else {
            return "Password is Wrong";
        }
    }

    public String AuthRegister(String username, String password, String email, String masterPasskey) {
        
        try {   
            if (userService.getUserByUsername(username) instanceof User) {
                return "Username already exists.";
            }
        } catch (Exception e) {}

        try {
            if (userService.getUserByEmail(email) instanceof User) {
                return "Email already used.";
            }
        } catch (Exception e) {}

        try {
            userService.addUser(username, password, email, masterPasskey);
        } catch (Exception e) {
            return "Unknown error";
        }

        return "Successful";
    }

    public String checkMasterKey(String username, String masterPasskey) {
        User user;

        try {   
            user = userService.getUserByUsername(username);
        } catch (UserNotFoundException e) {
            return "Invalid username";
        }

        if (user.getMasterPasskey().equals(encryptionService.sha256encryption(masterPasskey))) {
            return "Successful";
        } else {
            return "Failure";
        }

    }
}
