import { Module } from '@nestjs/common';
import { ServiceUserService } from './service-user.service';
import { ServiceUserController } from './service-user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
  ], 
  controllers: [
    ServiceUserController
  ],
  providers: [
    ServiceUserService
  ],
})

export class ServiceUserModule {}
