import { Controller, Get, Res,  Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
  constructor(
    private readonly serviceService: ServiceService
  ) {}

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
  async create( @Body() dto: CreateServiceDto, @UploadedFiles() files, @Res() res: Response) {
    try {
      const createService = await this.serviceService.create(dto, files);

      return res.status(HttpStatus.CREATED).json({
        message: 'success to create file',
        data: createService,
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create service',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const getServiceData = await this.serviceService.findAll();

      return res.status(HttpStatus.ACCEPTED).json({
        data: getServiceData
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get service',
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
