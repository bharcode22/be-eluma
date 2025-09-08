import { Module } from '@nestjs/common';
import { FavoritePropertiesService } from './favorite-properties.service';
import { FavoritePropertiesController } from './favorite-properties.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [
    FavoritePropertiesController
  ],
  providers: [
    FavoritePropertiesService
  ],
})
export class FavoritePropertiesModule {}
