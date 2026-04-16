const { body } = require("express-validator");

exports.queryValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name too long"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name too long"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),

  body("query")
    .trim()
    .notEmpty()
    .withMessage("Query cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Query too long")
];