import { Module } from '@nestjs/common';
import { PropertyOwnerService } from './property-owner.service';
import { PropertyOwnerController } from './property-owner.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [
    PropertyOwnerController
  ],
  providers: [
    PropertyOwnerService
  ],
})
export class PropertyOwnerModule {}
