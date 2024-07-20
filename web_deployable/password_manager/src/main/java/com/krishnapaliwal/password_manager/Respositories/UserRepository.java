package com.krishnapaliwal.password_manager.Respositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.krishnapaliwal.password_manager.Models.User;

/**
 * Repository interface for managing User entities.
 * Extends JpaRepository to inherit basic CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their username.
     * @param username The username to search for
     * @return An Optional containing the User if found, or empty if not
     */
    Optional<User> findByUsername(String username);

    /**
     * Find a user by their email address.
     * @param email The email address to search for
     * @return An Optional containing the User if found, or empty if not
     */
    Optional<User> findByEmail(String email);
}


