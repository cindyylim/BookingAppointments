package com.example.booking.dto;

public class AppointmentDTO {
    private Long id;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String location;
    private String service;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public String getClientEmail() {return clientEmail;}
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public String getClientPhone() {return clientPhone;}
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }
    public String getLocation() {return location;}
    public void setLocation(String loc) { this.location = loc; }
    public String getService() {return service;}
    public void setService(String service) { this.service = service; }

}
