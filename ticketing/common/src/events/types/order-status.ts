export enum OrderStatus  {
    // Default when order has been created
    CREATED = 'created',
    // User cancelled order or order is expired
    CANCELLED = 'cancelled',
    //
    AWAITTING_PAYMENT = 'awaitting:payment',
    // User paid successfully
    COMPLETED = 'completed' 
}