
import { Subjects } from "./subjects";
import { OrderStatus } from "./types";

export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete;
    data: {
        orderId: string;
    }
}