import { Controller, Get } from '@nestjs/common';
import { SayHalloService } from './say-hallo.service';

@Controller('')
export class SayHalloController {
  constructor(private readonly sayHalloService: SayHalloService) { }

  @Get()
  findAll() {
    try {
      const hallo = this.sayHalloService.findAll();

      return ({
        message: hallo,
      })
    } catch (error: any) {
      return error.message;
    }
  }
}
