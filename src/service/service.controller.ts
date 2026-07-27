import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Response } from 'express';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get('types')
  async getServiceTypes(@Res() res: Response) {
    try {
      const types = await this.serviceService.getServiceTypes();
      return res.status(HttpStatus.OK).json({
        message: 'success to get service types',
        data: types,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get service types',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Post('types')
  async createServiceType(@Body('service_type') service_type: string, @Res() res: Response) {
    try {
      const newType = await this.serviceService.createServiceType(service_type);
      return res.status(HttpStatus.CREATED).json({
        message: 'service type created successfully',
        data: newType,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create service type',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Patch('types/:id')
  async updateServiceType(
    @Param('id') id: string,
    @Body('service_type') service_type: string,
    @Res() res: Response
  ) {
    try {
      const updatedType = await this.serviceService.updateServiceType(id, service_type);
      return res.status(HttpStatus.OK).json({
        message: 'service type updated successfully',
        data: updatedType,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update service type',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Delete('types/:id')
  async removeServiceType(@Param('id') id: string, @Res() res: Response) {
    try {
      const deletedType = await this.serviceService.removeServiceType(id);
      return res.status(HttpStatus.OK).json({
        message: 'service type deleted successfully',
        data: deletedType,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to delete service type',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = path.join(process.cwd(), 'serviceImages');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, uniqueName + ext);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateServiceDto,
    @UploadedFiles() files: any[],
    @Res() res: Response
  ) {
    try {
      const createService = await this.serviceService.create(dto, files);

      return res.status(HttpStatus.CREATED).json({
        message: 'success to create service',
        data: createService,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create service',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Res() res?: Response
  ) {
    try {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 10;

      const result = await this.serviceService.findAll(
        pageNum,
        limitNum,
        search || ''
      );

      return res?.status(HttpStatus.OK).json({
        message: 'success to get all service data',
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return res?.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get service data',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const service = await this.serviceService.findOne(id);

      return res.status(HttpStatus.OK).json({
        message: 'success to get service data by id',
        data: service,
      });
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        message: 'Failed to get service',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = path.join(process.cwd(), 'serviceImages');
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, uniqueName + ext);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @UploadedFiles() files: any[],
    @Res() res: Response
  ) {
    try {
      const updatedService = await this.serviceService.update(id, dto, files);

      return res.status(HttpStatus.OK).json({
        message: 'service updated successfully',
        data: updatedService,
      });
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        message: 'Failed to update service',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const deletedService = await this.serviceService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: 'service deleted successfully',
        data: deletedService,
      });
    } catch (error: any) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        message: 'Failed to delete service',
        error: error.message,
      });
    }
  }
}
