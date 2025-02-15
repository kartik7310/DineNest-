import { rateLimit } from "express-rate-limit";
export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      error: "Too Many Requests",
      message: options.message,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
