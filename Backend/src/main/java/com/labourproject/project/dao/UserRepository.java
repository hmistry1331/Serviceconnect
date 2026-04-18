package com.labourproject.project.dao;

import com.labourproject.project.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findByRole(String role);

    List<User> findByIsSuspended(boolean isSuspended);

}
