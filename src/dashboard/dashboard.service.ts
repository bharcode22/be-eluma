import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async findAllStatsData() {
    const totalProperty = await this.prisma.properties.count()
    const totalUsers = await this.prisma.user.count()
    const totalPropertyOwner = await this.prisma.propertiesOwner.count()
    const totalService = await this.prisma.service.count()

    return {
      totalProperty,
      totalUsers,
      totalPropertyOwner,
      totalService
    }
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
      take: 5
    })

    return latestPropertyData
  }
}
