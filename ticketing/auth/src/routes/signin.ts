import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/users/signin", (req: Request, res: Response) => {
  res.send("Hi there!");
});

export { router as signinRouter };
