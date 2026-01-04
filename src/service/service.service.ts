import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(createServiceDto: CreateServiceDto, files: any[]) {
    const imageData = files?.map((file) => ({
      imagesUrl: `/serviceImages/${file.filename}`,
    }));

    return this.prisma.service.create({
      data: {
        type_id: createServiceDto.type_id,
        service_name: createServiceDto.service_name,
        service_type: createServiceDto.service_type,
        imagesService: {
          create: imageData,
        },
      },
      include: {
        imagesService: true,
      },
    });
  }

  async findAll() {
    const getServiceData = await this.prisma.service.findMany({
      include: {
        imagesService: true
      }
    })

    return getServiceData;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
