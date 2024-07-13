package com.krishnapaliwal.password_manager.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false, length = 255)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "acc_password_hash", nullable = false)
    private String accPasswordHash;

    @Column(name = "master_passkey", nullable = false)
    private String masterPasskey;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Password> passwords;

    // Getters and Setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAccPasswordHash() {
        return accPasswordHash;
    }

    public void setAccPasswordHash(String accPasswordHash) {
        this.accPasswordHash = accPasswordHash;
    }

    public String getMasterPasskey() {
        return masterPasskey;
    }

    public void setMasterPasskey(String masterPasskey) {
        this.masterPasskey = masterPasskey;
    }

    public List<Password> getPasswords() {
        return passwords;
    }

    public void setPasswords(List<Password> passwords) {
        this.passwords = passwords;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

