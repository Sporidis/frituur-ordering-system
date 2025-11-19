import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../domain/user-role.enum';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const adminUser = await this.usersService.findOne('admin');
    if (!adminUser) {
      const adminId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      await this.usersService.create({
        id: adminId,
        username: 'admin',
        password: 'password',
        role: UserRole.ADMIN,
      });
      console.log(`Admin user created with ID: ${adminId}`);
    }
  }
}
