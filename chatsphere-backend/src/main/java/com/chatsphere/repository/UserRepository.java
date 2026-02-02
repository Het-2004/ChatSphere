package com.chatsphere.repository;

import com.chatsphere.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Used during login & JWT validation
     */
    Optional<User> findByUsername(String username);

    /**
     * Used to check duplicate usernames at registration
     */
    boolean existsByUsername(String username);
}
