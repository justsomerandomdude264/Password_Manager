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

/**
 * Entity class representing a user in the password manager system.
 */
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

    /**
     * Gets the unique identifier of the user.
     * @return The ID of the user
     */
    public long getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the user.
     * @param id The ID to set
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Gets the username of the user.
     * @return The username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username of the user.
     * @param username The username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the email of the user.
     * @return The email address
     */
    public String getEmail() {
        return this.email;
    }

    /**
     * Sets the email of the user.
     * @param email The email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the hashed account password of the user.
     * @return The hashed account password
     */
    public String getAccPasswordHash() {
        return accPasswordHash;
    }

    /**
     * Sets the hashed account password of the user.
     * @param accPasswordHash The hashed account password to set
     */
    public void setAccPasswordHash(String accPasswordHash) {
        this.accPasswordHash = accPasswordHash;
    }

    /**
     * Gets the master passkey of the user.
     * @return The master passkey
     */
    public String getMasterPasskey() {
        return masterPasskey;
    }

    /**
     * Sets the master passkey of the user.
     * @param masterPasskey The master passkey to set
     */
    public void setMasterPasskey(String masterPasskey) {
        this.masterPasskey = masterPasskey;
    }

    /**
     * Gets the list of passwords associated with the user.
     * @return The list of Password objects
     */
    public List<Password> getPasswords() {
        return passwords;
    }

    /**
     * Sets the list of passwords associated with the user.
     * @param passwords The list of Password objects to set
     */
    public void setPasswords(List<Password> passwords) {
        this.passwords = passwords;
    }
}