
package com.fooddelivery.foodapp.service;

import com.fooddelivery.foodapp.model.User;
import com.fooddelivery.foodapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user
    public String register(User user) {
        User existing = userRepository.findByEmail(user.getEmail());
        if (existing != null) {
            return "Email already exists!";
        }
        userRepository.save(user);
        return "Registration successful!";
    }

    // Login - check email and password
    public String login(User user) {
        User existing = userRepository.findByEmail(user.getEmail());
        if (existing == null) {
            return "Email not found!";
        }
        if (!existing.getPassword().equals(user.getPassword())) {
            return "Wrong password!";
        }
        return "Login successful!";
    }
}