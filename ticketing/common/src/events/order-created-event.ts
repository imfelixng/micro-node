
import { Subjects } from "./subjects";
import { OrderStatus } from "./types";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string,
        status: OrderStatus
        ticketId: string,
        userId: string,
        expiresAt: string,
        ticket: {
            id: string,
            price: number,
        }
    }
}