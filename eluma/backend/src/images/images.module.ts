import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule
  ],
  controllers: [
    ImagesController
  ],
  providers: [
    ImagesService
  ],
})
export class ImagesModule {}
