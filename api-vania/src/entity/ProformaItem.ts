import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Proforma } from "./Proforma"
import { Product } from "./Product"

@Entity()
export class ProformaItem {

    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Proforma, proforma => proforma.items, { onDelete: "CASCADE" })
    proforma!: Proforma

    @ManyToOne(() => Product)
    @JoinColumn({ name: "productId" })
    product!: Product

    @Column()
    productId!: number

    @Column("int")
    quantity!: number

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number

    @Column("decimal", { precision: 10, scale: 2 })
    subtotal!: number
}
