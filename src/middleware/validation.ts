import { body, check } from "express-validator";

// Validation functions arrays for checking the user data
// and making sure that the data fulfills the requirements from
// our entities

export const postValidators = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 250 })
    .withMessage("Title must be at least 3 characters long."),
  body('imageURL')
    .trim()
    .isLength({ max: 250 })
    .withMessage("URL can not exceed 250 characters."),
  body("description")
    .trim()
    .isLength({ min: 5, max: 250 })
    .withMessage("Description must be at least 5 characters long."),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long."),
];

export const signupValidators = [
  check("username")
    .trim()
    .isLength({ min: 5, max: 250 })
    .isAlphanumeric(),
  check("email")
    .isLength({ max: 250 })
    .isEmail()
    .withMessage("Email is not valid!")
    .normalizeEmail(),
  check("password")
    .trim()
    .isLength({ min: 6, max: 250 })
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
    .isLength({ min: 6, max: 250 })
    .withMessage(
      "Password must contain numbers and letters and must be at least 6 characters long."
    )
    .isAlphanumeric(),
];
