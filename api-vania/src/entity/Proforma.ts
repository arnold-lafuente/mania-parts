import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { Client } from "./Client"
import { ProformaItem } from "./ProformaItem"

@Entity()
export class Proforma {

    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Client)
    @JoinColumn({ name: "clientId" })
    client!: Client

    @Column()
    clientId!: number

    @OneToMany(() => ProformaItem, item => item.proforma, { cascade: true })
    items!: ProformaItem[]

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    subtotal!: number

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    discount!: number

    @Column("decimal", { precision: 12, scale: 2 })
    total!: number

    @Column("varchar", { length: 50, default: "pendiente" })
    status!: string

    @Column("varchar", { length: 255, nullable: true })
    statusChangedBy!: string | null

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
