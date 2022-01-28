import { body, check } from "express-validator";

export const postValidators = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long."),
  body("description")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long."),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long."),
];

export const signupValidators = [
  check("username")
    .trim()
    .isAlphanumeric(),
  check("email")
    .isEmail()
    .withMessage("Email is not valid!")
    .normalizeEmail(),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage(
      "Password must contain numbers and letters and must be at least 6 characters long."
    )
    .isAlphanumeric(),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords does not match!");
      }
      return true;
    }),
];

export const loginValidators = [
  check("username").trim().isAlphanumeric(),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage(
      "Password must contain numbers and letters and must be at least 6 characters long."
    )
    .isAlphanumeric(),
];
