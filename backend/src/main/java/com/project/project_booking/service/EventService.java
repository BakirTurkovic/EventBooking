package com.project.project_booking.service;

import com.project.project_booking.model.Event;
import com.project.project_booking.model.Location;
import com.project.project_booking.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final LocationService locationService;

    public EventService(EventRepository eventRepository, LocationService locationService) {
        this.eventRepository = eventRepository;
        this.locationService = locationService;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event with ID " + id + " not found"));
    }

    public Event createEvent(Event event, Long locationId) {
        Location location = locationService.getLocationById(locationId);
        event.setLocation(location);
        return eventRepository.save(event);
    }
}