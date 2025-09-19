package com.example.booking.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String cancellationToken;
    private String location;
    private String service;

    @ManyToOne
    @JoinColumn(name = "time_slot_id")
    @JsonManagedReference
    private com.example.booking.model.TimeSlot timeSlot;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public com.example.booking.model.TimeSlot getTimeSlot() { return timeSlot; }
    public void setTimeSlot(com.example.booking.model.TimeSlot timeSlot) { this.timeSlot = timeSlot; }
    public String getCancellationToken() { return cancellationToken; }
    public void setCancellationToken(String cancellationToken) { this.cancellationToken = cancellationToken; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
} 