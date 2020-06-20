import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import {BadRequestError} from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    } as any;

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
