package com.krishnapaliwal.password_manager.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.krishnapaliwal.password_manager.Exceptions.UserNotFoundException;
import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;
import com.krishnapaliwal.password_manager.Services.AuthService;
import com.krishnapaliwal.password_manager.Services.PasswordService;
import com.krishnapaliwal.password_manager.Services.UserService;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ApiControllers {

    @Autowired
    AuthService authService;

    @Autowired
    UserService userService;

    @Autowired
    PasswordService passwordService;

    @PostMapping(path = "/login")
    public ResponseEntity<String> loginAPI(@RequestBody LoginRequest loginRequest) {
        String result = authService.AuthLogin(loginRequest.getUsername(), loginRequest.getPassword());

        switch (result) {
            case "Successful":
                return ResponseEntity.ok("Login successful");
            case "Username does not exist":
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found");
            case "Password is Wrong":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @PostMapping(path = "/register")
    public ResponseEntity<String> registerAPI(@RequestBody RegisterRequest registerRequest) {
        String result = authService.AuthRegister(registerRequest.getUsername(), registerRequest.getPassword(), registerRequest.getEmail(), registerRequest.getMasterPasskey());

        switch (result) {
            case "Successful":
                return ResponseEntity.ok("Register successful");
            case "Username already exists.":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username already exists");
            case "Email already used.":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email already in use");
            case "Unknown error":
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }

    @GetMapping(path = "/passwords/{username}")
    public ResponseEntity<List<Password>> getPasswordsAPI(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            List<Password> passwords = passwordService.getDecryptedPasswords(user);
            return ResponseEntity.ok(passwords);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping(path = "/check_master_key")
    public ResponseEntity<String> checkMasterKeyAPI(@RequestBody CheckMasterKeyRequest checkMasterKeyRequest) {
        String result = authService.checkMasterKey(checkMasterKeyRequest.getUsername(), checkMasterKeyRequest.getMasterPasskey());

        switch (result) {
            case "Successful":
                return ResponseEntity.ok("Key correct");
            case "Failure":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid crendentials");
            case "Invalid username":
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username not found");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    } 

    @PostMapping(path = "/add_password")
    public ResponseEntity<String> addPasswordAPI(@RequestBody AddPasswordRequest addPasswordRequest) {
        User user;

        try {
            user = userService.getUserByUsername(addPasswordRequest.getUser());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found");
        }

        try {
            passwordService.addPassword(user, addPasswordRequest.getTopic(), addPasswordRequest.getUsername(), addPasswordRequest.getPassword());
            return ResponseEntity.ok("Password added succesfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete_password/{id}")
    public ResponseEntity<String> deletePasswordAPI(@PathVariable Long id) {
        try {
            passwordService.deletePasswordById(id);
            return ResponseEntity.ok("Password deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting password: " + e.getMessage());
        }
    }
}

class LoginRequest {
    private String username;
    private String password;

     // Getters and setters
     public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String masterPasskey;

    // Getters and setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getMasterPasskey() {
        return masterPasskey;
    }
    public void setMasterPasskey(String masterPasskey) {
        this.masterPasskey = masterPasskey;
    }
}

class CheckMasterKeyRequest {
    private String username;
    private String masterPasskey;

    // Getters and setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getMasterPasskey() {
        return masterPasskey;
    }
    public void setMasterPasskey(String masterPasskey) {
        this.masterPasskey = masterPasskey;
    }
}

class AddPasswordRequest {
    private String user;
    private String username;
    private String topic;
    private String password;

    // Getters and setters
    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getTopic() {
        return topic;
    }
    public void setTopic(String topic) {
        this.topic = topic;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}