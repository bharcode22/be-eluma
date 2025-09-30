import { Module } from '@nestjs/common';
import { PropertyManagementService } from './property-management.service';
import { PropertyManagementController } from './property-management.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [
    PropertyManagementController
  ],
  providers: [
    PropertyManagementService
  ],
})

export class PropertyManagementModule {}
