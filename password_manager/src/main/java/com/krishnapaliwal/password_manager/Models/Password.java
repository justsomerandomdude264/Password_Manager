package com.krishnapaliwal.password_manager.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entity class representing a password entry in the database.
 */
@Entity
@Table(name = "passwords")
public class Password {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String topic;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(name = "encrypted_password", nullable = false, columnDefinition = "TEXT")
    private String encryptedPassword;

    // Getters and Setters

    /**
     * Gets the unique identifier of the password entry.
     * @return The ID of the password entry
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the password entry.
     * @param id The ID to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets the user associated with this password entry.
     * @return The User object
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the user associated with this password entry.
     * @param user The User object to set
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Gets the topic (e.g., website or application name) for this password entry.
     * @return The topic string
     */
    public String getTopic() {
        return topic;
    }

    /**
     * Sets the topic for this password entry.
     * @param topic The topic to set
     */
    public void setTopic(String topic) {
        this.topic = topic;
    }

    /**
     * Gets the username associated with this password entry.
     * @return The username string
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets the username for this password entry.
     * @param username The username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Gets the encrypted password string.
     * @return The encrypted password string
     */
    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    /**
     * Sets the encrypted password string.
     * @param encryptedPassword The encrypted password to set
     */
    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }
}