import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne } from "typeorm";
import Role from './role';
import Verification from './Verification';
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
    
    @Column()
    createdAt: Date;

    @Column()
    resetPasswordDate: Date;

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable({ name: 'userRoles' })
    roles: Role[];

    @OneToOne(() => Verification, verification => verification.user, { cascade: true })
    verification: Verification;

    @OneToOne(() => ChangePassword, changePassword => changePassword.user, { cascade: true })
    changePassword: ChangePassword;

}
