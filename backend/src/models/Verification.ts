import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import User from "./user";


@Entity()
export default class Verification {

    @PrimaryColumn()
    token: string;

    @Column()
    expiresAt: Date;

    @OneToOne(() => User, user => user.verification)
    @JoinColumn()
    user: User;
    
}
