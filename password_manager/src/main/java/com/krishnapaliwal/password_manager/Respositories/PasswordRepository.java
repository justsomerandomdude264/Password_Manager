package com.krishnapaliwal.password_manager.Respositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.lang.NonNull;

import com.krishnapaliwal.password_manager.Models.Password;
import com.krishnapaliwal.password_manager.Models.User;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long>{
    List<Password> findByUser(User user);
    void deleteById(@NonNull Long id);
}