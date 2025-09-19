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

    public void deleteTimeSlot(Long id) {
        TimeSlot slot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("TimeSlot not found"));

        // Assume slot is booked if not available or has appointments
        if (!slot.isAvailable()) {
            throw new IllegalStateException("Cannot delete a booked time slot.");
        }

        if (slot.getAppointments() != null && !slot.getAppointments().isEmpty()) {
            throw new IllegalStateException("Time slot has existing appointments.");
        }

        timeSlotRepository.deleteById(id);
    }
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        validateTimeSlot(timeSlot);
        checkForConflicts(timeSlot, null); // null for new creation
        return timeSlotRepository.save(timeSlot);
    }

    public TimeSlot updateTimeSlot(Long id, TimeSlot updated) {
        validateTimeSlot(updated);
        return timeSlotRepository.findById(id).map(ts -> {
            checkForConflicts(updated, id); // ignore conflict with itself
            ts.setStartTime(updated.getStartTime());
            ts.setEndTime(updated.getEndTime());
            ts.setAvailable(updated.isAvailable());
            return timeSlotRepository.save(ts);
        }).orElseThrow(() -> new IllegalArgumentException("TimeSlot not found"));
    }

    public void validateTimeSlot(TimeSlot timeSlot) {
        if (timeSlot.getStartTime() == null || timeSlot.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time must not be null.");
        }
        if (!timeSlot.getStartTime().isBefore(timeSlot.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time.");
        }
    }

    private void checkForConflicts(TimeSlot newSlot, Long excludeId) {
        List<TimeSlot> allSlots = timeSlotRepository.findAll();

        for (TimeSlot existing : allSlots) {
            if (excludeId != null && existing.getId().equals(excludeId)) {
                continue; // Skip self when updating
            }

            boolean overlaps = newSlot.getStartTime().isBefore(existing.getEndTime())
                    && newSlot.getEndTime().isAfter(existing.getStartTime());

            if (overlaps) {
                throw new IllegalArgumentException("Time slot overlaps with an existing slot.");
            }
        }
    }
    public boolean isOverlapping(TimeSlot newSlot) {
        return timeSlotRepository.findAll().stream().anyMatch(existing ->
            existing.getId() != null &&
            newSlot.getStartTime().isBefore(existing.getEndTime()) &&
            newSlot.getEndTime().isAfter(existing.getStartTime())
        );
    }

    public boolean isOverlapping(TimeSlot updatedSlot, Long excludeId) {
        return timeSlotRepository.findAll().stream().anyMatch(existing ->
            !existing.getId().equals(excludeId) &&
            updatedSlot.getStartTime().isBefore(existing.getEndTime()) &&
            updatedSlot.getEndTime().isAfter(existing.getStartTime())
        );
    }

    public boolean isBooked(Long id) {
        return timeSlotRepository.findById(id)
            .map(slot -> !slot.isAvailable())
            .orElse(false);
    }

} 