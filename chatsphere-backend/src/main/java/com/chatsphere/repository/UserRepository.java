package com.chatsphere.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.chatsphere.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetPasswordToken(String token);

    /**
     * Search users by email or name
     */
    List<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name);
}
