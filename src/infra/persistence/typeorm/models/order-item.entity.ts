import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { IOrderItem } from "@application/DTOs/order-item.interface";

@Entity({ name: "order_items" })
export class OrderItemEntity implements IOrderItem {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    order: OrderEntity;
    
    @Column({ name: 'product_id', nullable: false })
    productId: number;
    
    @Column({ name: 'product_name', nullable: false })
    productName: string;
    
    @Column({ name: 'product_price', nullable: false })
    productPrice: number;
    
    @Column({ name: 'quantity', nullable: false })
    quantity: number;
    
    @Column({ name: 'total_price', nullable: false })
    totalPrice: number;
    
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}