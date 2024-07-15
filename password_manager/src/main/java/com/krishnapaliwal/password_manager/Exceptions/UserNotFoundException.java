package com.krishnapaliwal.password_manager.Exceptions;

/**
 * Custom exception class representing a scenario where a user is not found in the system.
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * Constructs a new UserNotFoundException with the specified detail message.
     * @param message The detail message to be included in the exception.
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}
