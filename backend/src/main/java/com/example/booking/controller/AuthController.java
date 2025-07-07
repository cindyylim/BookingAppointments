package com.example.booking.controller;

import com.example.booking.model.User;
import com.example.booking.repository.UserRepository;
import com.example.booking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        if (userRepository.findByUsername(req.get("username")).isPresent() ||
            userRepository.findByEmail(req.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Username or email already exists");
        }
        User user = new User();
        user.setUsername(req.get("username"));
        user.setPassword(passwordEncoder.encode(req.get("password")));
        user.setEmail(req.get("email"));
        user.setPhone(req.get("phone"));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        return userRepository.findByUsername(req.get("username")).map(user -> {
            if (passwordEncoder.matches(req.get("password"), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "phone", user.getPhone()
                    )
                ));
            } else {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
        }).orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
} 