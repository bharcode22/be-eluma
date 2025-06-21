import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from './../prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [
    UsersController
  ],
  providers: [
    PrismaService, 
    UsersService
  ],
})
export class AppModule {}
