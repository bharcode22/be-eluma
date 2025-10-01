import { Injectable } from '@nestjs/common';
import { CreatePropertyManagementDto } from './dto/create-property-management.dto';
import { UpdatePropertyManagementDto } from './dto/update-property-management.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyManagementService {
  constructor(private prisma: PrismaService) {}

  create(createPropertyManagementDto: CreatePropertyManagementDto) {
    return 'This action adds a new propertyManagement';
  }

async getAllProperty(page: number, limit: number, search?: string) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search ? {
      OR: [
        { property_tittle: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { property_code: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    } : {}),
    deleted_at: null
  };

  const [properties, totalItems] = await Promise.all([
    this.prisma.properties.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        user_id: true,
        property_code: true,
        property_tittle: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        maximum_guest: true,
        minimum_stay: true,
        price: true,
        monthly_price: true,
        yearly_price: true,
        isPublic: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    }),
    this.prisma.properties.count({ where })
  ]);

  return {
    meta: {
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      limit,
    },
    data: properties,
  };
}

  findOne(id: number) {
    return `This action returns a #${id} propertyManagement`;
  }

  update(id: number, updatePropertyManagementDto: UpdatePropertyManagementDto) {
    return `This action updates a #${id} propertyManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyManagement`;
  }
}
