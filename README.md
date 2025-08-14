# Task Management API

This is a full-featured RESTful API for managing boards, lists, and tasks—similar to Trello. Built with Node.js, Express, MongoDB, and Mongoose, it includes user authentication with JWT and access control for private boards.

## Quick Start

1. Clone the repository
- git clone https://github.com/maximo-ale/task-management-api.git
- cd task-management-api

2. Install dependencies
- npm install

3. Copy '.env.example' to '.env'
- On Windows CMD:
copy .env.example .env
- On Windows PowerShell:
Copy-Item .env.example .env
- On Linux/macOS:
cp .env.example .env

4. The '.env' file already includes a test user and a public database:
- PORT=3000
- MONGO_URI=mongodb+srv://testUser:testPassword@cluster.uzqisyr.mongodb.net/?
- JWT_SECRET=JWT_example

4. Start the server
- npm start

## Features

- User registration and login with JWT
- Create and manage boards, lists (columns), and tasks
- Role-based access: board owners and members
- Assign users to tasks
- Move tasks between lists
- Filter tasks by state, tags, or assigned user
- Invite users to boards

## Technologies

- Node.js
- Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt
- Postman (for manual testing)

## Proyect Structure

- Config
- Controllers
- Middlewares
- Models
- Node_modules
- Routes
- Utils
- server.js
- .env (ignored)

## Available endpoints:

## Auth

| Method | Route               | Description               |
|--------|---------------------|---------------------------|
| POST   | /api/auth/register  | Register a new user       |
| POST   | /api/auth/login     | Login and get JWT token   |

## Board

| Method | Route                              | Description                                           |
|--------|-------------------------------------|-------------------------------------------------------|
| POST   | /api/board/create                   | Create a new board (authenticated users)             |
| POST   | /api/board/invite/:id               | Invite user by email (only board owner)              |
| GET    | /api/board/member                   | Get all boards where user is member or owner         |
| GET    | /api/board/findBoard/:id            | Get board by ID (must be member or owner)            |
| PATCH  | /api/board/modify/:id               | Modify title/description (only board owner)          |
| DELETE | /api/board/delete/:id               | Delete board (only board owner)                      |

## List

| Method | Route                                      | Description                                 |
|--------|---------------------------------------------|---------------------------------------------|
| GET    | /api/list/board/:id/lists                  | Get all lists in a board                    |
| POST   | /api/list/create/:id                       | Create a list in a board                    |
| PATCH  | /api/list/modify/:id                       | Modify a list's title or position           |
| DELETE | /api/list/delete/:id                       | Delete a list from a board                  |

## Task

| Method | Route                                      | Description                                             |
|--------|---------------------------------------------|---------------------------------------------------------|
| GET    | /api/task/find/:id                         | Get all tasks in a list                                 |
| POST   | /api/task/create                           | Create a new task (must be in a valid board list)       |
| PATCH  | /api/task/modify/:id                       | Modify task fields (title, description, etc.)           |
| PATCH  | /api/task/move/:id                         | Move task to another list (same board only)             |
| PATCH  | /api/task/assign/:id                       | Assign user to task (must be member of the board)       |
| DELETE | /api/task/delete/:id                       | Delete a task                                           |

## Notes:
Users can only be assigned to tasks if they are part of the board.

Lists and tasks cannot be moved across boards.

Task filtering via query parameters (e.g. /task/find/:id?state=done&tags=urgent).

## Author
Developed by Máximo Ale.
Contact: maximoale20000@gmail.com