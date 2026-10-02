# User REST API

A completely functioning REST API built using Express and the native MongoDB driver (`mongodb`).

## Folder Structure
- **config/db.js**: MongoDB native driver connection initialization and initial seeding logic.
- **controllers/userController.js**: Handlers for all business logic and CRUD operations.
- **routes/userRoutes.js**: Express routing for exactly mapping HTTP inputs to controller functions.
- **server.js**: Entry point configuring the Express app, middleware, and bringing MongoDB and routes up.

## Prerequisites
- Node.js (v14+ recommended)
- MongoDB running locally on `mongodb://localhost:27017`

## Setup Instructions

1. **Install Dependencies**
   Run the following terminal command from this directory:
   ```bash
   npm install
   ```

2. **Run MongoDB**
   Make sure you have your MongoDB server daemon running on default port `27017`.

3. **Start the Application**
   ```bash
   npm start
   ```

The application will start, connect to MongoDB automatically, check if there are users, and gracefully insert `{"name":"Ravi", "age":22}` if the collection is vacant.

## Endpoints Provided
- `GET /users` - Retrieve all users.
- `POST /users` - Insert a new user (Needs `{"name": "...", "age": ...}`).
- `PUT /users/:id` - Update the user specifying `id`.
- `DELETE /users/:id` - Remove a user by `id`.
