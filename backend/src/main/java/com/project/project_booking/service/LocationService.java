package com.project.project_booking.service;

import com.project.project_booking.model.Location;
import com.project.project_booking.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location with ID " + id + " not found"));
    }

    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }
}