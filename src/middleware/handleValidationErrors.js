import { validationResult } from 'express-validator';

export function checkValidationResults(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result
      .array({ onlyFirstError: true })
      .map((err) => String(err.msg));
    return res.status(400).json({ errors });
  }
  next();
}