import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/users.service';
import { User } from './domain/user.entity';
import { UsersController } from './infrastructure/http/users.controller';
import { SeederService } from './application/seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, SeederService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
