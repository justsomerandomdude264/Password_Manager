package com.krishnapaliwal.password_manager.Respositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;
import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;

/**
 * Repository interface for managing Password entities.
 * Extends JpaRepository to inherit basic CRUD operations.
 */
@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {

    /**
     * Find all passwords associated with a specific user.
     * @param user The User entity to search passwords for
     * @return A List of Password entities belonging to the user
     */
    List<Password> findByUser(User user);

    /**
     * Delete a password entry by its ID.
     * @param id The ID of the password to delete
     */
    @Override
    void deleteById(@NonNull Long id);
}