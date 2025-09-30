import { Module } from '@nestjs/common';
import { UsersManagementService } from './users-management.service';
import { UsersManagementController } from './users-management.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [
    UsersManagementController
  ],
  providers: [
    UsersManagementService
  ],
})
export class UsersManagementModule {}
