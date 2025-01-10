import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task';
import {Role} from '../../auth/role/role.enum';

@Entity( {name:'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
      })
      role: Role;

    @OneToMany((_type) => Task, (task) => task.user, { eager: true })
    tasks: Task[];
}
