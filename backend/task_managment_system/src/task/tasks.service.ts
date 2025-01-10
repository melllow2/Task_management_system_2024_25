import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../typeorm/entities/task';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../typeorm/entities/user';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  getTaskById(id: number, user: User): Promise<Task> {
    return this.tasksRepository.getTaskById(id, user);
  }

  deleteTask(id: number, user: User): Promise<void> {
    return this.tasksRepository.deleteTask(id, user);
  }

  updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    return this.tasksRepository.updateTask(id, status, user);
  }
}
