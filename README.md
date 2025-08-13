# DevTinder

A full-stack dating app for developers. Built to showcase my backend development skills for potential employers.

## What I Built

A complete Node.js application with user authentication, profile management, and a matching system. Users can browse other developers, send connection requests, and build their network.

**Key Features:**
- JWT-based authentication with secure password hashing
- RESTful API with proper error handling
- MongoDB with complex relationship modeling
- Smart feed algorithm that filters already-contacted users
- Comprehensive input validation

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Security:** JWT, bcrypt, validator.js
- **Tools:** ESLint, nodemon

## Quick Start

```bash
git clone https://github.com/rohan03122001/DevTinder.git
npm install
# Add MONGO_URI to .env file
npm run dev
```

## API Endpoints

```
Auth:        POST /signup, /login, /logout
Profile:     GET /profile/view, PATCH /profile/edit, /profile/password
Requests:    POST /request/send/:status/:userID, /request/review/:status/:requestID
Discovery:   GET /user/requests, /user/connections, /user/feed
```

## Architecture Highlights

- **Clean separation:** Routes, models, middleware, and utilities properly organized
- **Database design:** Efficient schemas with proper references and validation
- **Security:** Authentication middleware, input sanitization, duplicate request prevention
- **Performance:** Pagination, selective field population, optimized queries

## What This Demonstrates

Full-stack development skills including API design, database modeling, authentication systems, and clean code architecture.

