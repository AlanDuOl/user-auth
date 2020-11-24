import {Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import User from "./user";


@Entity()
export class Verification {

    @PrimaryColumn()
    token: string;

    @OneToOne(() => User, user => user.verification)
    @JoinColumn()
    user: User;
    
}
