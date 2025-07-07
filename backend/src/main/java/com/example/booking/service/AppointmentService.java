package com.example.booking.service;

import com.example.booking.model.Appointment;
import com.example.booking.model.TimeSlot;
import com.example.booking.repository.AppointmentRepository;
import com.example.booking.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.UUID;

import java.util.List;
import java.util.Optional;
import com.example.booking.model.User;
import java.util.Date;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final JavaMailSender mailSender;

    public AppointmentService(AppointmentRepository appointmentRepository, TimeSlotRepository timeSlotRepository, JavaMailSender mailSender) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.mailSender = mailSender;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointment(Long id) {
        return appointmentRepository.findById(id);
    }

    @Transactional
    public Appointment bookAppointment(Appointment appointment, Long timeSlotId, User user) {
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId).orElseThrow();
        if (!timeSlot.isAvailable()) {
            throw new IllegalStateException("Time slot is not available");
        }
        timeSlot.setAvailable(false);
        timeSlotRepository.save(timeSlot);
        appointment.setTimeSlot(timeSlot);
        if (user != null) {
            appointment.setUser(user);
        }
        // Generate cancellation token
        String token = UUID.randomUUID().toString();
        appointment.setCancellationToken(token);
        Appointment saved = appointmentRepository.save(appointment);
        // Send email
        sendAppointmentEmail(saved);
        return saved;
    }

    private void sendAppointmentEmail(Appointment appointment) {
        String to = appointment.getCustomerEmail();
        String subject = "Appointment Confirmation & Cancellation Link";
        String cancelUrl = "http://localhost:8080/api/appointments/cancel/" + appointment.getCancellationToken();
        String text = String.format(
            "Dear %s,\n\nYour appointment is confirmed for %s - %s.\n\nIf you wish to cancel, click here: %s\n\nThank you!",
            appointment.getCustomerName(),
            Date.from(appointment.getTimeSlot().getStartTime().toInstant()).toLocaleString(),
            Date.from(appointment.getTimeSlot().getEndTime().toInstant()).toLocaleString(),
            cancelUrl
        );
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void cancelAppointment(Long id) {
        appointmentRepository.findById(id).ifPresent(appointment -> {
            TimeSlot slot = appointment.getTimeSlot();
            if (slot != null) {
                slot.setAvailable(true);
                timeSlotRepository.save(slot);
            }
            appointmentRepository.deleteById(id); // This deletes the row
        });
    }

    public boolean cancelAppointmentByToken(String token) {
        Appointment appointment = appointmentRepository.findAll().stream()
            .filter(a -> token.equals(a.getCancellationToken()))
            .findFirst().orElse(null);
        if (appointment == null) return false;
        TimeSlot slot = appointment.getTimeSlot();
        if (slot != null) {
            slot.setAvailable(true);
            timeSlotRepository.save(slot);
        }
        appointmentRepository.delete(appointment); // This deletes the row
        return true;
    }
} 