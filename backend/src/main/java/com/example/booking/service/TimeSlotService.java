package com.example.booking.service;

import com.example.booking.model.TimeSlot;
import com.example.booking.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotService(TimeSlotRepository timeSlotRepository) {
        this.timeSlotRepository = timeSlotRepository;
    }

    public List<TimeSlot> getAllTimeSlots() {
        return timeSlotRepository.findAll();
    }

    public Optional<TimeSlot> getTimeSlot(Long id) {
        return timeSlotRepository.findById(id);
    }

    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }

    public void deleteTimeSlot(Long id) {
        timeSlotRepository.deleteById(id);
    }

    public TimeSlot updateTimeSlot(Long id, TimeSlot updated) {
        return timeSlotRepository.findById(id).map(ts -> {
            ts.setStartTime(updated.getStartTime());
            ts.setEndTime(updated.getEndTime());
            ts.setAvailable(updated.isAvailable());
            return timeSlotRepository.save(ts);
        }).orElseThrow();
    }
} 