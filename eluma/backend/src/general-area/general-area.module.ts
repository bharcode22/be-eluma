import { Module } from '@nestjs/common';
import { GeneralAreaService } from './general-area.service';
import { GeneralAreaController } from './general-area.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [
    GeneralAreaController
  ],
  providers: [
    GeneralAreaService
  ],
})
export class GeneralAreaModule {}
