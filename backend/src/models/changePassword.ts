import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import User from "./user";

@Entity()
export class ChangePassword {

    @PrimaryColumn()
    token: string;

    @Column()
    expiresAt: Date;

    @Column()
    validated: boolean;

    @OneToOne(() => User, user => user.verification)
    @JoinColumn()
    user: User;

}
