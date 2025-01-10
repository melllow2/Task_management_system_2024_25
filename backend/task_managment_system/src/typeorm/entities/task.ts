import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { TaskStatus } from 'src/task/task.status.enum';
import { Exclude } from 'class-transformer';

@Entity( {name:'tasks'})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    user: User;
}
