// src/validators/userValidators.ts

import { body } from 'express-validator';

export const signUpValidator = [
    body('username').isAlphanumeric().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).trim().escape(),
    // Add more validators as needed...
];

export const loginValidator = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 5 }).trim().escape(),
    // Add more validators as needed...
];
