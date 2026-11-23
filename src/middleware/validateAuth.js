import { body } from 'express-validator';
import { checkValidationResults } from './handleValidationErrors.js';

export const validateSignup = [
  body('email')
    .isString()
    .withMessage('Email is required')
    .bail()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('password')
    .isString()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6, max: 72 })
    .withMessage('Password must be between 6 and 72 characters'),
  body('name')
    .isString()
    .withMessage('Name is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  checkValidationResults,
];

export const validateLogin = [
  body('email')
    .isString()
    .withMessage('Email is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .isString()
    .withMessage('Password is required')
    .bail()
    .notEmpty()
    .withMessage('Password is required'),
  checkValidationResults,
];