import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

async findAllStatsData(from?: string, to?: string) {
    const whereCondition: Prisma.PropertiesOwnerWhereInput = {
      deleted_at: null,
      ...(from && to && {
        created_at: {
          gte: new Date(from),
          lte: new Date(to),
        },
      }),
    };

    // 2. Ambil data owner sesuai filter
    const allOwners = await this.prisma.propertiesOwner.findMany({
      where: whereCondition,
      select: {
        id: true,
        phone: true,
      },
    });

    // 3. Deduplicate berdasarkan phone
    const uniqueDataMap = new Map<string, typeof allOwners[0]>();
    for (const item of allOwners) {
      if (item.phone && !uniqueDataMap.has(item.phone)) {
        uniqueDataMap.set(item.phone, item);
      }
    }
    const uniqueOwners = Array.from(uniqueDataMap.values());

    // 4. Hitung data lain (bisa pakai filter juga kalau mau)
    const totalProperty = await this.prisma.properties.count({
      where: { deleted_at: null },
    });

    const totalUsers = await this.prisma.user.count({
      where: { deleted_at: null },
    });

    const totalService = await this.prisma.service.count({
      where: { deleted_at: null },
    });

    // 5. Kembalikan hasil
    return {
      totalProperty,
      totalUsers,
      totalPropertyOwner: uniqueOwners.length,
      totalService,
    };
  }

  async latestProperty() {
    const latestPropertyData = await this.prisma.properties.findMany({
      orderBy: {
        created_at: 'desc'
      }, 
      select: {
        property_code: true, 
        number_of_bedrooms: true, 
        number_of_bathrooms: true, 
        maximum_guest: true,
        minimum_stay: true,
        price: true,
        monthly_price: true,
        yearly_price: true,
        isPublic: true,
        created_at: true,
      }, 
      take: 5, 
      where: {
        deleted_at: null
      }
    })

    return latestPropertyData
  }
}
