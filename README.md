# Project Backend and Database Overview (Demo Version)

## Overview
This document provides an overview of the backend and database structure for the project. This is a **demo version** with **dummy data** to demonstrate functionality and architecture.

## Tech Stack
- **Backend Framework:** Node.js with Express
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Hosting:** (e.g., Vercel, Render web service, Render databases)
- **Session Management:** Express Sessions, Redis 
- **Security & Middleware:**
  - **CORS** for cross-origin requests
  - **Body-parser** for handling JSON and URL-encoded data

## API Endpoints

## Authentication

### Login
**Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticate a user and return a token.
- **Authorization:** None

### Register
**Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Register a new user. This API is not included in the front-end due to stakeholder requirements.
- **Authorization:** None

### Check Session
**Endpoint:** `/check-session`
- **Method:** `GET`
- **Description:** Check the session for a logged-in user. Session is valid for 1 hour as required.
- **Authorization:** `isAuthenticated`

## Order Management

### Cancel Order
**Endpoint:** `/cancel-order`
- **Method:** `POST`
- **Description:** Cancel an order.
- **Authorization:** `isAuthenticated`

### Complete Order
**Endpoint:** `/complete-order`
- **Method:** `POST`
- **Description:** Assign an order as completed.
- **Authorization:** `isAuthenticated`

### Get Driver Orders
**Endpoint:** `/get-driver-order`
- **Method:** `GET`
- **Description:** Retrieve driver order data.
- **Authorization:** `isAuthenticated`, `isDriver`

### Edit Order
**Endpoint:** `/edit-order`
- **Method:** `POST`
- **Description:** Allows admins to edit orders.
- **Authorization:** `isAuthenticated`, `isAdmin`

### Get Order Details
**Endpoint:** `/get-order`
- **Method:** `GET`
- **Description:** Retrieve details of a specific order.
- **Authorization:** `isAuthenticated`

### Insert Order
**Endpoint:** `/insert-order`
- **Method:** `POST`
- **Description:** Insert a new order into the system.
- **Authorization:** `isAuthenticated`

### Update Order
**Endpoint:** `/update-order`
- **Method:** `POST`
- **Description:** Update an order after a driver submits it.
- **Authorization:** `isAuthenticated`, `isDriver`

## Battery Management

### Get Battery Details
**Endpoint:** `/get-battery-det`
- **Method:** `POST`
- **Description:** Retrieve battery details by entering its name to get information like the technician's name and the serial number, which is considered the order ID.
- **Authorization:** `isAuthenticated`, `isAdmin`

### Get Warranty Card
**Endpoint:** `/getWarrantyCard`
- **Method:** `GET`
- **Description:** Retrieve warranty card details.
- **Authorization:** `isAuthenticated`, `isAdmin`

### Get Serial Battery
**Endpoint:** `/getSerialBattery`
- **Method:** `GET`
- **Description:** Retrieve details of a battery using its serial number.
- **Authorization:** `isAuthenticated`, `isAdmin`

### Replace Battery
**Endpoint:** `/replace-battery`
- **Method:** `POST`
- **Description:** Replace a battery by checking its sold date or serial number and assigning it as replaced. This action creates a new order with status `replaced`.
- **Authorization:** `isAuthenticated`, `isAdmin`

## Search Functionality

### Search Car
**Endpoint:** `/searchCar`
- **Method:** `POST`
- **Description:** Search for a car by entering details such as car manufacture or model.
- **Authorization:** `isAuthenticated`, `isAdmin`

### Search Battery
**Endpoint:** `/searchBattery`
- **Method:** `POST`
- **Description:** Search for battery details, such as price, by entering car details or the battery name.
- **Authorization:** `isAuthenticated`, `isAdmin`

## Notes
- This is a demo version with dummy data.
- The production version will include role-based authentication, validation, and secure data handling.
- Future improvements include integrating cloud storage and real-time updates.

---
**Author:** Mohamed
