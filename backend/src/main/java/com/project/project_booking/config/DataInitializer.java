package com.project.project_booking;

import com.project.project_booking.model.Event;
import com.project.project_booking.model.Location;
import com.project.project_booking.repository.EventRepository;
import com.project.project_booking.repository.LocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final LocationRepository locationRepository;
    private final EventRepository eventRepository;

    public DataInitializer(LocationRepository locationRepository, EventRepository eventRepository) {
        this.locationRepository = locationRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (locationRepository.count() == 0) {
            Location loc1 = new Location(null, "Dom Mladih", "Sarajevo", 800);
            Location loc2 = new Location(null, "BKC", "Sarajevo", 500);
            Location loc3 = new Location(null, "Mostar Arena", "Mostar", 1200);

            locationRepository.save(loc1);
            locationRepository.save(loc2);
            locationRepository.save(loc3);

            Event event1 = new Event(
                    null,
                    "Tech Summit 2026",
                    "Godišnja konferencija o softverskom inženjeringu i AI-u.",
                    LocalDateTime.now().plusDays(10),
                    new BigDecimal("35.00"),
                    150,
                    loc1
            );

            Event event2 = new Event(
                    null,
                    "Rock Concert",
                    "Uživo nastup lokalnih bendova.",
                    LocalDateTime.now().plusDays(15),
                    new BigDecimal("20.00"),
                    300,
                    loc2
            );

            Event event3 = new Event(
                    null,
                    "Stand-Up Komedija",
                    "Večer smijeha i zabave.",
                    LocalDateTime.now().plusDays(5),
                    new BigDecimal("15.00"),
                    80,
                    loc3
            );

            eventRepository.save(event1);
            eventRepository.save(event2);
            eventRepository.save(event3);
        }
    }
}