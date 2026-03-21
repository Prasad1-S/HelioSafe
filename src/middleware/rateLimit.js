import rateLimit from 'express-rate-limit';

const createLimiter = (limit, windowMs = 15 * 60 * 1000) =>
  rateLimit({
    windowMs,
    limit,
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const loginLimiter = createLimiter(5);
export const verifyLimiter = createLimiter(10);