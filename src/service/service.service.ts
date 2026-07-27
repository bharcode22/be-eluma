import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async getServiceTypes() {
    return this.prisma.serviceType.findMany({
      where: { deleted_at: null },
    });
  }

  async create(createServiceDto: CreateServiceDto, files: any[]) {
    const imageData = files?.map((file) => ({
      imagesUrl: `/serviceImages/${file.filename}`,
    })) || [];

    let serviceTypeName = createServiceDto.service_type;

    if (createServiceDto.type_id) {
      const selectedType = await this.prisma.serviceType.findUnique({
        where: { id: createServiceDto.type_id },
      });
      if (selectedType && selectedType.service_type) {
        serviceTypeName = selectedType.service_type;
      }
    }

    return this.prisma.service.create({
      data: {
        type_id: createServiceDto.type_id || null,
        service_name: createServiceDto.service_name || null,
        service_type: serviceTypeName || null,
        description: createServiceDto.description || null,
        status: createServiceDto.status || 'active',
        imagesService: imageData.length > 0 ? {
          create: imageData,
        } : undefined,
      },
      include: {
        imagesService: true,
        serviceType: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      deleted_at: null,
    };

    if (search && search.trim() !== '') {
      whereCondition.OR = [
        { service_name: { contains: search, mode: 'insensitive' } },
        { service_type: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          imagesService: true,
          serviceType: true,
        },
      }),
      this.prisma.service.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        imagesService: true,
        serviceType: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, files?: any[]) {
    await this.findOne(id);

    const imageData = files?.map((file) => ({
      imagesUrl: `/serviceImages/${file.filename}`,
    })) || [];

    let serviceTypeName = updateServiceDto.service_type;

    if (updateServiceDto.type_id) {
      const selectedType = await this.prisma.serviceType.findUnique({
        where: { id: updateServiceDto.type_id },
      });
      if (selectedType && selectedType.service_type) {
        serviceTypeName = selectedType.service_type;
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(updateServiceDto.type_id !== undefined && { type_id: updateServiceDto.type_id }),
        ...(updateServiceDto.service_name !== undefined && { service_name: updateServiceDto.service_name }),
        ...(serviceTypeName !== undefined && { service_type: serviceTypeName }),
        ...(updateServiceDto.description !== undefined && { description: updateServiceDto.description }),
        ...(updateServiceDto.status !== undefined && { status: updateServiceDto.status }),
        updated_at: new Date(),
        imagesService: imageData.length > 0 ? {
          create: imageData,
        } : undefined,
      },
      include: {
        imagesService: true,
        serviceType: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
