import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { RequestHandler } from "express";

import { User } from "../entities/User";

dotenv.config();

const getSignUp: RequestHandler = (req, res) => {
  res.render("auth/signUp", {
    pageTitle: "Sign up",
    errorMessage: null,
    oldInput: {
      name: null,
      surname: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
    },
  });
};

const getLogin: RequestHandler = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: null,
    oldInput: {
      username: null,
      password: null,
    },
  });
};

const postSignUp: RequestHandler = async (req, res) => {
  const { name, surname, username, email, password, confirmPassword } =
    req.body;
  const oldInput = {
    name,
    surname,
    username,
    email,
    password,
    confirmPassword,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "Sign up",
      errorMessage: errors.array()[0].msg,
      oldInput,
    });
  }
  // Checking that the username is unique
  const userRepo = getRepository(User);
  const userWithUsername = await userRepo.findOne({ username });
  if (userWithUsername) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "Sign up",
      errorMessage: "Username already exists!",
      oldInput,
    });
  }
  // Checking that the email is unique
  const userWithEmail = await userRepo.findOne({ email });
  if (userWithEmail) {
    return res.status(422).render("auth/signUp", {
      pageTitle: "Sign up",
      errorMessage: "Email already exists!",
      oldInput,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRepo = getRepository(User);
    let user = new User();
    user.name = name;
    user.surname = surname;
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    await userRepo.save(user);
    res.redirect("/login");
  } catch (err) {
    throw new Error(err as string);
  }
};

const postLogin: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  const oldInput = { username, password };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput,
    });
  }
  try {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ username });
    if (!user) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        errorMessage: "Invalid username!",
        oldInput,
      });
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(401).render("auth/login", {
        pageTitle: "Login",
        errorMessage: "Invalid password!",
        oldInput,
      });
    }
    // Creating our JWT token with 2h expiration time
    const token = jwt.sign(
      {
        username: user.username,
        userId: user.id,
      },
      process.env.PRIVATE_KEY,
      { expiresIn: "2h" }
    );
    // Storing our JWT token in cookies
    res.cookie("token", token, { httpOnly: true });
    // Storing user data in our session
    if (req.headers["user-agent"]) {
      req.session.browser = req.headers["user-agent"];
    }
    req.session.user = user.username;
    res.redirect("/");
  } catch (err) {
    throw new Error(err as string);
  }
};

const postLogout: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new Error(err);
    }
    res.cookie("token", "Null", { httpOnly: true });
    res.redirect("/");
  });
};

export default { getSignUp, getLogin, postSignUp, postLogin, postLogout };
