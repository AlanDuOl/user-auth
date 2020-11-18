import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import Role from './role';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;
    
    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @ManyToMany(() => Role, { cascade: true })
    @JoinTable({ name: 'userRoles' })
    roles: Role[];
}
