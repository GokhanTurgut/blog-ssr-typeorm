import path from "path";

import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createConnection, getRepository } from "typeorm";
import { TypeormStore } from 'typeorm-store';
import { Session } from './entities/Session';

import { get404, get500 } from "./controllers/error";
import blogRoutes from "./routes/blog";
import authRoutes from "./routes/auth";
import { checkUser } from "./middleware/checkAuth";

dotenv.config();

// Accessing environment variables and checking them to
// make sure they exists.
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.SESSION_SECRET) {
  throw new Error("Session secret does not exist!");
}

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

// Creating connection to our MySQL database with the help
// from TypeORM using the configuration options inside our
// ormconfig.js file
createConnection().then(() => {
  app.set("view engine", "ejs");

  // Middleware for parsing incoming request body from form data
  app.use(express.urlencoded({ extended: false }));
  // Middleware for setting our public folder as accessible
  app.use(express.static(path.join(__dirname, "..", "public")));
  // Middleware for parsing cookies inside requests
  app.use(cookieParser());
  // Getting our session repository based on our Session entity
  const repository = getRepository(Session);
  // Middleware for creating our session with a cookie 2 hours long
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({ repository }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2h
        httpOnly: true,
      },
    })
  );

  // Custom middleware for checking session data
  // and adding isLoggedIn to locals
  app.use(checkUser);

  // Routes
  app.use(blogRoutes);
  app.use(authRoutes);

  // Server error handler
  app.use(get500);

  // Page not found error handler
  app.use(get404);

  // Start listening on our chosen port
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
