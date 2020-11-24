import {Entity, Column, OneToOne, JoinColumn } from "typeorm";
import User from "./user";


@Entity()
export class Verification {

    @Column()
    token: string;

    @OneToOne(() => User, user => user.verification)
    @JoinColumn()
    user: User;
}
