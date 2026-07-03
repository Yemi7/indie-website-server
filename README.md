# Indie Website Server

## Description

This is the backend server for an indie games community app. It provides authentication, game management, posts, comments, image uploads, and public home feed endpoints.

## Technologies used

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Cloudinary
- Multer
- Morgan
- CORS

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following values:

   ```env
   MONGO_URI=<your-mongo-uri>
   TOKEN_SECRET=<your-jwt-secret>
   ORIGIN=<allowed-client-origin>
   CLOUDINARY_NAME=<cloudinary-cloud-name>
   CLOUDINARY_KEY=<cloudinary-api-key>
   CLOUDINARY_SECRET=<cloudinary-api-secret>
   PORT=5005
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

4. By default, the server runs at:

   ```
   http://localhost:5005
   ```

## Server structure

- `server.js` - application entry point
- `config/index.js` - middleware and app configuration
- `db/index.js` - MongoDB connection logic
- `routes/` - endpoint route files
- `models/` - Mongoose schemas
- `middleware/` - authentication and Cloudinary upload middleware
- `errors/index.js` - error handler

## Models

### User

- `email` (String, required, unique)
- `password` (String, required)
- `username` (String, required, unique)
- `profilePic` (String, default)
- `role` (String, enum: `user`, `dev`, `admin`, default `user`)
- `bio` (String)

### Game

- `title` (String, required)
- `startDate` (Date, required)
- `expectedRelease` (Date, required)
- `engine` (String, required)
- `genre` (String)
- `cover` (String, required)
- `images` (Array of String)
- `user` (ObjectId, ref `User`)
- `status` (String, enum: `released, developing, cancelled`)
- `description` (String)

### Post

- `title` (String, required)
- `content` (Mixed, required)
- `game` (ObjectId, ref `Game`)
- `user` (ObjectId, ref `User`)

### Comment

- `description` (String, required)
- `user` (ObjectId, ref `User`)
- `post` (ObjectId, ref `Post`)

## API Endpoints

Base URL: `/api`

### Authentication

| Method | Path           | Body                            | Auth | Description                      |
| ------ | -------------- | ------------------------------- | ---- | -------------------------------- |
| POST   | `/auth/signup` | `{ email, username, password }` | No   | Register a new user              |
| POST   | `/auth/login`  | `{ email, password }`           | No   | Authenticate user and return JWT |
| GET    | `/auth/verify` | -                               | Yes  | Verify token and return payload  |

### Games

| Method | Path            | Body                                                                               | Auth        | Description                     |
| ------ | --------------- | ---------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| GET    | `/game`         | -                                                                                  | No          | Retrieve all games              |
| GET    | `/game/:gameId` | -                                                                                  | No          | Retrieve game details           |
| POST   | `/game`         | `{ title, startDate, expectedRelease, engine, genre, cover, images, description }` | Yes (user)  | Create a new game               |
| PATCH  | `/game/:gameId` | `{ title, startDate, expectedRelease, engine, genre, cover, images, description }` | Yes         | Update a game owned by the user |
| DELETE | `/game/:gameId` | -                                                                                  | Yes (admin) | Delete a game                   |

### Posts

| Method | Path                    | Body                             | Auth        | Description              |
| ------ | ----------------------- | -------------------------------- | ----------- | ------------------------ |
| POST   | `/post`                 | `{ title, content, game }`       | Yes         | Create a post for a game |
| GET    | `/post/:gameId/by-game` | -                                | No          | List posts for a game    |
| GET    | `/post/:postId`         | -                                | No          | Get a single post        |
| PATCH  | `/post/:postId`         | `{ title, content, user, game }` | Yes         | Update own post          |
| DELETE | `/post/:postId`         | -                                | Yes (admin) | Delete a post            |

### Comments

| Method | Path                       | Body                                                | Auth | Description                        |
| ------ | -------------------------- | --------------------------------------------------- | ---- | ---------------------------------- |
| POST   | `/comment`                 | `{ username, profilePic, description, post }`       | Yes  | Create a comment                   |
| GET    | `/comment/:postId/by-post` | -                                                   | No   | List comments for a post           |
| PATCH  | `/comment/:commentId`      | `{ username, profilePic, description, user, post }` | Yes  | Update own comment                 |
| DELETE | `/comment/:commentId`      | -                                                   | Yes  | Delete own comment or admin delete |

### User

| Method | Path                            | Auth | Description                             |
| ------ | ------------------------------- | ---- | --------------------------------------- |
| GET    | `/user`                         | Yes  | Get current logged-in user              |
| GET    | `/user/user/:userId`            | No   | Get a public user profile               |
| GET    | `/user/games`                   | Yes  | Get games created by current user       |
| GET    | `/user/comments`                | Yes  | Get comments created by current user    |
| GET    | `/user/games/:userId/public`    | No   | Get games created by a specific user    |
| GET    | `/user/comments/:userId/public` | No   | Get comments created by a specific user |

### Home feed

| Method | Path          | Auth | Description                    |
| ------ | ------------- | ---- | ------------------------------ |
| GET    | `/home/games` | No   | Get latest games for home feed |
| GET    | `/home/posts` | No   | Get latest posts for home feed |

### Uploads

| Method | Path                    | Auth | Description            |
| ------ | ----------------------- | ---- | ---------------------- |
| POST   | `/upload/upload-one`    | No   | Upload a single image  |
| POST   | `/upload/upload-many`   | No   | Upload multiple images |
| POST   | `/upload/upload-editor` | No   | Upload an editor image |

### Misc

| Method | Path       | Auth | Description    |
| ------ | ---------- | ---- | -------------- |
| GET    | `/example` | No   | Test API route |

## Environment variables

- `MONGO_URI`
- `TOKEN_SECRET`
- `ORIGIN`
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`
- `PORT` (optional)

## Notes / Backlog

- Add request validation for required fields and types
- Add more robust role-based authorization for game endpoints
- Return more detailed error responses for create/update failures
- Add pagination for home feed and game listings

## Links

- Server repository: local project
- Deploy: https://indie-website-server.vercel.app
