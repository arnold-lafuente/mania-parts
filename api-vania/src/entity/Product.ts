import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ nullable: true })
    code!: string

    @Column({ nullable: true })
    unit!: string

    @Column({ nullable: true })
    location!: string

    @Column({ nullable: true })
    brand!: string

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    price!: number

    @Column("decimal", { precision: 12, scale: 2, nullable: true })
    previousPrice!: number | null

    @Column("decimal", { precision: 12, scale: 2, nullable: true })
    cost!: number | null

    @Column("int", { default: 0 })
    stock!: number

    @Column("varchar", { length: 255, nullable: true })
    lastModifiedBy!: string | null

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
