import { Publisher, ExpirationCompleteEvent, Subjects } from "@anqtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;   
}