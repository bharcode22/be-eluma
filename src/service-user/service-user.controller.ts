import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ServiceUserService } from './service-user.service';

@Controller('service-user')
export class ServiceUserController {
  constructor(private readonly serviceUserService: ServiceUserService) { }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const serviceData = await this.serviceUserService.findAll();

      return res.status(HttpStatus.OK).json({
        message: "succes to get service data",
        data: serviceData
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create service',
        error: error.message,
      });
    }
  }
}
