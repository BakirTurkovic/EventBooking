package com.project.project_booking.service;

import com.project.project_booking.model.Event;
import com.project.project_booking.model.Reservation;
import com.project.project_booking.repository.EventRepository;
import com.project.project_booking.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository,
                              EventRepository eventRepository,
                              EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Reservation createReservation(Long eventId, String customerName, String customerEmail, Integer numberOfTickets) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < numberOfTickets) {
            throw new RuntimeException("Not enough available tickets");
        }

        event.setAvailableTickets(event.getAvailableTickets() - numberOfTickets);
        eventRepository.save(event);

        BigDecimal totalPrice = event.getTicketPrice().multiply(BigDecimal.valueOf(numberOfTickets));

        Reservation reservation = new Reservation();
        reservation.setEvent(event);
        reservation.setCustomerName(customerName);
        reservation.setCustomerEmail(customerEmail);
        reservation.setNumberOfTickets(numberOfTickets);
        reservation.setTotalPrice(totalPrice);

        Reservation savedReservation = reservationRepository.save(reservation);

        // Slanje potvrdnog emaila korisniku
        try {
            emailService.sendBookingConfirmation(
                    savedReservation.getCustomerEmail(),
                    savedReservation.getCustomerName(),
                    event.getTitle(),
                    savedReservation.getNumberOfTickets(),
                    savedReservation.getTotalPrice()
            );
        } catch (Exception e) {
            // Logiramo grešku ako email ne prođe, ali ne rušimo rezervaciju u bazi
            System.err.println("Failed to send booking email: " + e.getMessage());
        }

        return savedReservation;
    }

    public List<Reservation> getReservationsByEmail(String email) {
        return reservationRepository.findByCustomerEmail(email);
    }

    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Event event = reservation.getEvent();
        event.setAvailableTickets(event.getAvailableTickets() + reservation.getNumberOfTickets());
        eventRepository.save(event);

        reservationRepository.delete(reservation);
    }
}