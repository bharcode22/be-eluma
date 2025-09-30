import { Injectable } from '@nestjs/common';
import { CreatePropertyManagementDto } from './dto/create-property-management.dto';
import { UpdatePropertyManagementDto } from './dto/update-property-management.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PropertyManagementService {
  constructor(private prisma: PrismaService) {}

  create(createPropertyManagementDto: CreatePropertyManagementDto) {
    return 'This action adds a new propertyManagement';
  }

  async getAllProperty() {
    const data = await this.prisma.properties.findMany({
      select: {
        id: true, 
        user_id: true, 
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
      }
    })

    return data;
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
