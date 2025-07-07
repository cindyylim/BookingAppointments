package com.example.booking.controller;

import com.example.booking.model.Appointment;
import com.example.booking.model.User;
import com.example.booking.repository.AppointmentRepository;
import com.example.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "email", user.getEmail(),
            "phone", user.getPhone()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Map<String, String> req) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        user.setEmail(req.getOrDefault("email", user.getEmail()));
        user.setPhone(req.getOrDefault("phone", user.getPhone()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getUserAppointments(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        List<Appointment> all = appointmentRepository.findAll().stream()
            .filter(a -> a.getUser() != null && a.getUser().getId().equals(user.getId()))
            .collect(Collectors.toList());
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        List<Appointment> upcoming = all.stream().filter(a -> a.getTimeSlot().getStartTime().isAfter(now)).collect(Collectors.toList());
        List<Appointment> history = all.stream().filter(a -> a.getTimeSlot().getStartTime().isBefore(now)).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of(
            "upcoming", upcoming,
            "history", history
        ));
    }
} 