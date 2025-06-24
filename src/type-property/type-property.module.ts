import { Module } from '@nestjs/common';
import { TypePropertyService } from './type-property.service';
import { TypePropertyController } from './type-property.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [
    PrismaModule
  ],
  controllers: [
    TypePropertyController
  ],
  providers: [
    TypePropertyService
  ],
})
export class TypePropertyModule {}
