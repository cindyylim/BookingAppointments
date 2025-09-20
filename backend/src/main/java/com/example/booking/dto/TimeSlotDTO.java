package com.example.booking.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class TimeSlotDTO {
    private Long id;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private boolean available;
    private List<AppointmentDTO> appointments;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OffsetDateTime getStartTime() { return startTime; }
    public void setStartTime(OffsetDateTime startTime) { this.startTime = startTime; }

    public OffsetDateTime getEndTime() { return endTime; }
    public void setEndTime(OffsetDateTime endTime) { this.endTime = endTime; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public List<AppointmentDTO> getAppointments() { return appointments; }
    public void setAppointments(List<AppointmentDTO> appointments) { this.appointments = appointments; }
}
