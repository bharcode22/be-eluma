import { Module } from '@nestjs/common';
import { SayHalloService } from './say-hallo.service';
import { SayHalloController } from './say-hallo.controller';

@Module({
  controllers: [SayHalloController],
  providers: [SayHalloService],
})
export class SayHalloModule { }
