package com.project.project_booking.repository;

import com.project.project_booking.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Custom metoda koja automatski kreira SQL za pretragu rezervacija po emailu!
    List<Reservation> findByCustomerEmail(String customerEmail);
}