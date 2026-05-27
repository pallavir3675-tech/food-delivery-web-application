package com.fooddelivery.foodapp.controller;

import com.fooddelivery.foodapp.model.User;
import com.fooddelivery.foodapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return userService.register(user);
    }

    // POST http://localhost:8080/api/users/login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(user);
    }
}
