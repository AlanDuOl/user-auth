import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export default class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;
}
