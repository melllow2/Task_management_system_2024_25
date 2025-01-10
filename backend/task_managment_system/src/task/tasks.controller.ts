import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from '../typeorm/entities/task';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../typeorm/entities/user';
import { GetUser } from '../auth/get-user-decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';


@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<{ message: string; tasks: Task[] }> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`
    );
    const tasks = await this.tasksService.getTasks(filterDto, user);
    return {
      message: 'Tasks retrieved successfully',
      tasks,
    };
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ message: string; task: Task }> {
    const task = await this.tasksService.getTaskById(id, user);
    return {
      message: `Task with ID ${id} retrieved successfully`,
      task,
    };
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<{ message: string; task: Task }> {
    this.logger.verbose(
      `User ${user.username} creating a new task. Data: ${JSON.stringify(createTaskDto)}`
    );
    const task = await this.tasksService.createTask(createTaskDto, user);
    return {
      message: 'Task created successfully',
      task,
    };
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.tasksService.deleteTask(id, user);
    return {
      message: `Task with ID ${id} deleted successfully`,
    };
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<{ message: string; task: Task }> {
    const { status } = updateTaskStatusDto;
    const task = await this.tasksService.updateTaskStatus(id, status, user);
    return {
      message: `Task with ID ${id} updated successfully to status ${status}`,
      task,
    };
  }
}
