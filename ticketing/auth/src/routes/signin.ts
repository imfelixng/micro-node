import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passworsdMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passworsdMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJWT = jwt.sign(
      {
        email: existingUser.email,
        _id: existingUser._id,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    } as any;

    return res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
