import { Injectable } from '@nestjs/common';
import { CreateServiceUserDto } from './dto/create-service-user.dto';
import { UpdateServiceUserDto } from './dto/update-service-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceUserService {
    constructor(
    private prisma: PrismaService
  ) {}

  async findAll() {
    const serviceData = await this.prisma.service.findMany({
      where: {
        status: 'active',
      }, 
      select: {
        id: true, 
        service_name: true,
        service_type: true,
        status: true,
        description: true, 
        imagesService: {
          select: {
            imagesUrl: true,
          }
        }
      }
    })

    return serviceData;
  }
}
