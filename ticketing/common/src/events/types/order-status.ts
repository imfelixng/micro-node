export enum OrderStatus  {
    // Default when order has been created
    CREATED = 'created',
    // User cancelled order or order is expired
    CANCELLED = 'cancelled',
    //
    AWAITING_PAYMENT = 'awaiting:payment',
    // User paid successfully
    COMPLETED = 'completed' 
}