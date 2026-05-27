package com.fooddelivery.foodapp.repository;

import com.fooddelivery.foodapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}