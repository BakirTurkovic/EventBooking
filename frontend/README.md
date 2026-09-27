# Event Booking System

## Project Overview
Event Booking System is a full-stack web application for browsing events and booking tickets.

Users can view available events, make reservations, search for their bookings using an email address, and cancel reservations. When a booking is made, the number of available tickets is updated and a confirmation email is sent to the user.

The backend is built with Spring Boot and PostgreSQL, while the frontend is built with React and Vite.

## Prerequisites
Before running the application, make sure you have:
Java JDK 17+
Node.js 18.x or 20.x
PostgreSQL 14+
Maven 3.x (or use the included Maven wrapper)

## Backend Setup
Navigate to the backend directory:
cd project-booking

Configure your PostgreSQL database and email settings in:
src/main/resources/application.properties

Example configuration:
spring.datasource.url=jdbc:postgresql://localhost:5432/event_booking_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD

spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

Run the backend:
./mvnw spring-boot:run

The API will run on:
http://localhost:8080

## Frontend Setup
Navigate to the frontend directory:
cd project-booking-frontend

Install dependencies:
npm install

Start the frontend:
npm run dev

The application will run on:
http://localhost:5173

## Features
Browse upcoming events and check available tickets.
Book tickets for an event.
Receive an email confirmation after making a reservation.
Search for existing reservations using an email address.
Cancel a reservation and return the tickets to the available ticket count.

## API Endpoints
GET    /api/events
POST   /api/reservations
GET    /api/reservations/user?email={email}
DELETE /api/reservations/{id}

## Notes
PostgreSQL needs to be running before starting the backend.
To use Gmail for confirmation emails, create a Gmail App Password and use it in the mail configuration.