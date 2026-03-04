import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import * as bcrypt from "bcryptjs"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    username!: string

    @Column()
    password!: string

    @Column({ default: "user" })
    role!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$2a$")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        console.log(password, this.password)
        const test = await bcrypt.compare(password, this.password);
        console.log('----->',test)
        return test
    }
}
