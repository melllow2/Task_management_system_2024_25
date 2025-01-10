import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/user';
import { Task } from './typeorm/entities/task';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './task/tasks.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
     type:'mysql',
     host: 'localhost',
     port:3306,
     username:'root',
     password: '',
     database: 'task_managment_database',
     entities:[User,Task],
     synchronize: true,
  }), AuthModule, TasksModule,AdminModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
