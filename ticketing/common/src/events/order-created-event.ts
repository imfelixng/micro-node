
import { Subjects } from "./subjects";
import { OrderStatus } from "./types";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: number;
        status: OrderStatus;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        }
    }
}