package com.project.project_booking.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequest {
    private Long eventId;
    private String customerName;
    private String customerEmail;
    private Integer numberOfTickets;
}