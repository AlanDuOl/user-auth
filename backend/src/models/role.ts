import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('roles')
export default class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;
}
