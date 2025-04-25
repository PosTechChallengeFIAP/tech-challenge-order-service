import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "./order-item.entity";
import { EOrderStatus } from "@domain/models/order-status.enum";

@Entity({ name: "orders" })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'status', nullable: false, type: 'enum', enum: EOrderStatus })
    status: EOrderStatus;

    @Column({ name: 'payment_id', nullable: false })
    paymentId: number;

    @Column({ name: 'pdv_id', nullable: false })
    pdvId: number;

    @Column({ name: 'pdv_name', nullable: false })
    pdvName: string;

    @Column({ name: 'client_id', nullable: true })
    clientId?: number;

    @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
    orderItems: OrderItemEntity[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}