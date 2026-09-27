package com.project.project_booking.controller;

import com.project.project_booking.model.Reservation;
import com.project.project_booking.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest request) {
        Reservation reservation = reservationService.createReservation(
                request.getEventId(),
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getNumberOfTickets()
        );
        return new ResponseEntity<>(reservation, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Reservation>> getReservationsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(reservationService.getReservationsByEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}