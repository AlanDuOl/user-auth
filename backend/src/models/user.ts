import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne } from "typeorm";
import Role from './role';
import { Verification } from './verification';
import { ChangePassword } from './changePassword'

@Entity()
export default class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @Column()
    isVerified: boolean;

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable({ name: 'userRoles' })
    roles: Role[];

    @OneToOne(() => Verification, verification => verification.user)
    verification: Verification;

    @OneToOne(() => ChangePassword, changePassword => changePassword.user)
    changePassword: ChangePassword;

}
