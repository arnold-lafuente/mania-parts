import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Product } from "./Product"

@Entity()
export class InvoiceEntry {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    invoiceNumber!: string

    @Column()
    provider!: string

    @Column()
    productId!: number

    @ManyToOne(() => Product, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product!: Product

    @Column("decimal", { precision: 12, scale: 2 })
    cost!: number

    @Column("decimal", { precision: 12, scale: 2 })
    salePrice!: number

    @Column("int")
    quantity!: number

    @Column("decimal", { precision: 12, scale: 2 })
    total!: number

    @Column("varchar", { length: 255, nullable: true })
    registeredBy!: string | null

    @CreateDateColumn()
    createdAt!: Date
}
