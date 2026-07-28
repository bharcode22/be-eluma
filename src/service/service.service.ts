import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

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
        service_name: createServiceDto.service_name,
        service_type: serviceTypeName,
        description: createServiceDto.description,
        status: createServiceDto.status || 'active',
        ...(createServiceDto.type_id && { type_id: createServiceDto.type_id }),
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

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
    };

    if (search) {
      where.OR = [
        { service_name: { contains: search, mode: 'insensitive' } },
        { service_type: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          imagesService: true,
          serviceType: true,
        },
      }),
      this.prisma.service.count({ where }),
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

    // Delete specific images if requested
    if (updateServiceDto.deleteImageIds) {
      let idsToDelete: string[] = [];
      if (typeof updateServiceDto.deleteImageIds === 'string') {
        try {
          idsToDelete = JSON.parse(updateServiceDto.deleteImageIds);
        } catch {
          idsToDelete = [updateServiceDto.deleteImageIds];
        }
      } else if (Array.isArray(updateServiceDto.deleteImageIds)) {
        idsToDelete = updateServiceDto.deleteImageIds;
      }

      if (idsToDelete.length > 0) {
        const imagesToDelete = await this.prisma.imagesService.findMany({
          where: { id: { in: idsToDelete } },
        });

        imagesToDelete.forEach((img) => {
          if (img.imagesUrl) {
            const filePath = path.join(process.cwd(), img.imagesUrl);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (err) {
                console.error('Failed to delete file from disk:', err);
              }
            }
          }
        });

        await this.prisma.imagesService.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }
    }

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

  async removeImage(imageId: string) {
    const img = await this.prisma.imagesService.findUnique({
      where: { id: imageId },
    });

    if (!img) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    if (img.imagesUrl) {
      const filePath = path.join(process.cwd(), img.imagesUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('Failed to delete file from disk:', err);
        }
      }
    }

    return this.prisma.imagesService.delete({
      where: { id: imageId },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Delete associated images first (Cascading Delete)
    await this.prisma.imagesService.deleteMany({
      where: { service_id: id },
    });

    return this.prisma.service.delete({
      where: { id },
    });
  }

  async createServiceType(service_type: string) {
    return this.prisma.serviceType.create({
      data: { service_type },
    });
  }

  async updateServiceType(id: string, service_type: string) {
    return this.prisma.serviceType.update({
      where: { id },
      data: { service_type, updated_at: new Date() },
    });
  }

  async removeServiceType(id: string) {
    return this.prisma.serviceType.delete({
      where: { id },
    });
  }
}
