import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { DataSource, Repository } from 'typeorm';
  import { User } from '../typeorm/entities/user';
  import { AuthCredentialsDto } from './dto/auth-credentials.dto';
  import * as bcrypt from 'bcrypt';
  
  @Injectable()
  export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
      super(User, dataSource.createEntityManager());
    }
  
    async createUser(authCredentialsDTO: AuthCredentialsDto): Promise<void> {
      const { username, password} = authCredentialsDTO;
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = this.create({ username, password: hashedPassword});
  
      try {
        await this.save(user);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException();
        }
      }
    }
  }