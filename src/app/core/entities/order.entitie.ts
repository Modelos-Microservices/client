
export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    PAID = 'PAID',
}

export type Order = {
    id: string,
    total_amount: number,
    totalItems: number,
    user_id: string,
    status: OrderStatus,
    paid: boolean,
    paidAt: any,
    stripeChargeID: any,
    createdAt: string,
    updatedAt: string,
    OrderItem: OrderItem[]
}

export type OrderItem = {
    id: string,
    productId: number,
    quantity: number,
    price: number,
    orderId: string,
    productName: string,
    productImg: string
}

export type UpdateOrderItemDto = {
    productId: number;
    newQuantity: number;
}

export type  DeleteOrderItemDto = {
    productId: number;
}



export type CreateOrderItemDto = {
    productId: number;
    quantity: number;
}


