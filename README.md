# LinkorgAPI Documentation

## Overview
**LinkorgAPI** is a RESTful API developed using **TypeScript/JavaScript**, **Node.js**, **Express.js**, and **Mongoose**. The API supports a variety of functionalities, including user administration, booking management, and handling contact forms and inquiries. The development utilizes tools such as **Nodemon** for real-time server updates and **TypeScript** for type safety and scalability.

### Key Technologies:
- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Minimalistic framework for routing and request handling.
- **TypeScript**: Provides static typing for enhanced code reliability.
- **Mongoose**: ODM for managing MongoDB operations and schema definitions.
- **Nodemon**: Facilitates automatic server reloading during development.
- **dotenv**: Environment variable management for secure configuration.
- **Express-session**: Handles user session management.
- **Helmet**: Adds security headers for enhanced protection.
- **express-rate-limit**: Prevents DDoS attacks by rate-limiting incoming requests.
- **bcrypt**: Securely hashes passwords before storage.
- **JWT (JSON Web Tokens)**: For authentication and secure token-based authorization.

## Environment Setup:
1. **Node.js**: Ensure you have Node.js installed.
2. **MongoDB**: Set up a local MongoDB instance or use a cloud service like MongoDB Atlas.
3. **Nodemon**: Install globally for development (`npm install -g nodemon`).

## Installation:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/LinkorgAPI.git
   cd LinkorgAPI
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file at the project root and include the following:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/linkorgdb
   JWT_SECRET=your_jwt_secret
   SECRET_KEY=your_session_secret
   NODE_ENV=development
   ```

## Running the Project:
- **Development** (with live-reload):
  ```bash
  npm run dev
  ```
- **Production** (run compiled JavaScript):
  ```bash
  npm start
  ```

## Project Structure:
```plaintext
LinkorgAPI/
├── api/
│   └── index.js
├── build/
│   └── dist/
│       └── compiled files
├── config/
│   └── index.ts
├── public/
│   └── .gitkeep
├── src/
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   ├── booking.controller.ts
│   │   └── contact.controller.ts
│   │   └── enquiry.controller.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── admin.model.ts
│   │   ├── Booking.model.ts
│   │   └── Contact.model.ts
│   │   └── enquiry.model.ts
│   ├── routes/
│   │   ├── admin.route.ts
│   │   ├── booking.route.ts
│   │   └── contact.route.ts
│   │   └── enquiry.route.ts
│   ├── utils/
│   │   └── appError.ts
│   ├── app.ts
│   ├── db.config.ts
├── .env
├── package.json
└── tsconfig.json
```

### Notable Files:
- **`app.ts`**: Configures middleware, routes, and global error handling.
- **`db.config.ts`**: Manages the MongoDB connection setup.
- **`appError.ts`**: Custom class for uniform error handling.

## API Endpoints:
### 1. Admin Routes (`/api/v1/admin`)
- **POST `/register`**: Register a new admin.
  - **Request Body**:
    ```json
    {
      "fname": "John",
      "lname": "Doe",
      "email": "johndoe@example.com",
      "phone": "1234567890",
      "password": "password123",
      "confirmPassword": "password123"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Admin registered successfully.",
      "token": "jwt-token",
      "admin": {
        "fname": "John",
        "lname": "Doe",
        "email": "johndoe@example.com",
        "phone": "1234567890"
      },
      "nextStep": "/next-login-page"
    }
    ```

- **POST `/login`**: Admin login.
  - **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "success",
      "token": "jwt-token",
      "nextStep": "/next-dashboard"
    }
    ```

### 2. Booking Routes (`/api/v1/bookings`)
- **GET `/`**: Retrieve all bookings.
- **POST `/create`**: Create a new booking.
  - **Request Body**: Include booking details.

### 3. Contact Routes (`/api/v1/contacts`)
- **POST `/submit`**: Submit a contact form.
  - **Request Body**: Provide contact details.
- **GET `/`**: Fetch all contact form submissions.

### 4. Enquiry Routes (`/api/v1/enquiries`)
- **POST `/submit`**: Submit an inquiry.
- **GET `/`**: Retrieve all submitted inquiries.

## Error Handling:
- **Global Error Middleware**: Catches all errors and sends a JSON response with the status code and error message.
- **AppError Class**: Used for throwing errors consistently.
  ```typescript
  throw new AppError("Custom error message", 400);
  ```

## Security Features:
- **Helmet**: Adds essential HTTP headers for security.
- **CORS**: Configured to allow requests only from specified origins.
- **Rate Limiting**: Prevents abuse by limiting the number of requests per IP.
- **bcrypt**: Hashes passwords for safe storage.
- **JWT**: Used for securing authentication and authorization processes.

## Session Management:
- **Express-session**: Manages session data with configurable cookies.
- **connect-mongo**: Persists session data in MongoDB for consistency.

## Deployment:
The **LinkorgAPI** is deployed at:
**Base URL**: [https://linkorgnet.vercel.app/api/v1](https://linkorgnet.vercel.app/api/v1)

## Future Enhancements:
- **Unit Testing**: Integrate **Jest** or **Mocha** for robust test coverage.
- **Swagger Documentation**: Create interactive API documentation.
- **Role-Based Access Control**: Implement user roles for enhanced authorization.

---

This documentation provides a complete guide to setting up, understanding, and interacting with the **LinkorgAPI**.
