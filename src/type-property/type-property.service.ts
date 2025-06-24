import { Injectable } from '@nestjs/common';
import { CreateTypePropertyDto } from './dto/create-type-property.dto';
import { UpdateTypePropertyDto } from './dto/update-type-property.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TypePropertyService {
  constructor(private prisma: PrismaService) {}

  async createType(data: CreateTypePropertyDto) {
    const createPropertyType = await this.prisma.propertyType.create({
      data: { 
        type_name: data.type_name
      }
    })

    return createPropertyType;
  }

  async findAll() {
    const getAllPropertyType = await this.prisma.propertyType.findMany({})

    return getAllPropertyType;
  }
  
  async findOne(id: string) {
    const getAllPropertyById = await this.prisma.propertyType.findMany({
      where: {
        id: id
      }
    })
    return getAllPropertyById
  }

  update(id: number, data: UpdateTypePropertyDto) {
    return `This action updates a #${id} typeProperty`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeProperty`;
  }
}
