import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@anqtickets/common";

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    async (req: Request, res: Response) => {
        return res.status(200).send([]);
    }
);

export { router as newOrderRouter };