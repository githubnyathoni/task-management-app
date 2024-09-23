# Task Management API

This is the backend API for the Task Management application built using NestJS. The API provides endpoints for user management, task creation, assignment, and comment features.

## Features

- User Registration and Authentication
- Task Creation and Management
- Real-time Task Updates (WebSocket)
- Task Assignment
- Task Comments
- Email Notifications
- Swagger API Documentation

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/task-management-api.git
   cd task-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a .env file (use .env.example as a reference):

   ```bash
   cp .env.example .env
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the application:
   ```bash
   npm run start:dev
   ```

## ERD

![Alt text](https://i.imgur.com/xciu1h6.png 'an ERD')

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

This API uses Swagger for comprehensive documentation of available endpoints.

Accessing the Swagger Documentation
Once the server is running, you can access the Swagger UI for API documentation by navigating to the following URL:

```
http://localhost:3000/v1/api
```

Swagger provides detailed information about the available routes, request/response schemas, and allows you to directly interact with the API.
