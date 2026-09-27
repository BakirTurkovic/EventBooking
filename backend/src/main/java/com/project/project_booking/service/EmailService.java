package com.project.project_booking.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(String toEmail, String customerName, String eventTitle, int tickets, BigDecimal totalPrice) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("eventbooking@support.com");
        message.setTo(toEmail);
        message.setSubject("Potvrda rezervacije - " + eventTitle);

        String text = String.format(
                "Pozdrav %s,\n\nUspješno ste rezervisali karte za događaj: %s!\n\nDetalji rezervacije:\n- Broj karata: %d\n- Ukupan iznos: $%s\n\nHvala vam što koristite EventBooking!",
                customerName, eventTitle, tickets, totalPrice
        );

        message.setText(text);
        mailSender.send(message);
    }
}