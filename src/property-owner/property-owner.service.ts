import { Injectable } from '@nestjs/common';
import { CreatePropertyOwnerDto } from './dto/create-property-owner.dto';
import { UpdatePropertyOwnerDto } from './dto/update-property-owner.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyOwnerService {
    constructor(private prisma: PrismaService) {}

  create(createPropertyOwnerDto: CreatePropertyOwnerDto) {
    return 'This action adds a new propertyOwner';
  }

  async findAllOwner(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const where: Prisma.PropertiesOwnerWhereInput = {
      deleted_at: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const allData = await this.prisma.propertiesOwner.findMany({
      where,
      orderBy: { 
        created_at: 'desc' 
      },
    });

    const uniqueDataMap = new Map<string, typeof allData[0]>();
    for (const item of allData) {
      if (!uniqueDataMap.has(item.phone)) {
        uniqueDataMap.set(item.phone, item);
      }
    }
    const uniqueData = Array.from(uniqueDataMap.values());

    const paginatedData = uniqueData.slice(skip, skip + limit);

    return {
      total: uniqueData.length,
      page,
      limit,
      totalPages: Math.ceil(uniqueData.length / limit),
      data: paginatedData,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} propertyOwner`;
  }

  update(id: number, updatePropertyOwnerDto: UpdatePropertyOwnerDto) {
    return `This action updates a #${id} propertyOwner`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyOwner`;
  }
}
