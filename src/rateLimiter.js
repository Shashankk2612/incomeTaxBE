const rateLimit = require("express-rate-limit");

exports.queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests
  message: {
    error: "Too many queries sent. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});