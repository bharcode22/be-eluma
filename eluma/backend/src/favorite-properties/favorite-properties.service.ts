import { Injectable } from '@nestjs/common';
import { CreateFavoritePropertyDto } from './dto/create-favorite-property.dto';
import { UpdateFavoritePropertyDto } from './dto/update-favorite-property.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoritePropertiesService {
    constructor(private prisma: PrismaService) {}
  async saveProperty(createFavoritePropertyDto: CreateFavoritePropertyDto, user_id: string, property_id: string) {
    const saveProperty = await this.prisma.favoriteProperties.create({
      data: {
        user_id: user_id,  
        property_id: property_id,
        status: true
      }
    })

    return saveProperty;
  }

  async getMyFavProperties(user_id: string) {
    const getProperties = await this.prisma.favoriteProperties.findMany({
      where: {
        user_id: user_id, 
      }
    })
    return getProperties;
  }

  async getProperties(propertyIds: string[]) {
    const getProperties = await this.prisma.properties.findMany({
      where: {
        id: { in: propertyIds }
      }, 
      include: {
        location: true,
        availability: true,
        facilities: true,
        images: true,
        propertiesOwner: true,
        additionalDetails: true
      }
    });
    return getProperties;
  }

  findOne(id: number) {
    return `This action returns a #${id} favoriteProperty`;
  }

  update(id: number, updateFavoritePropertyDto: UpdateFavoritePropertyDto) {
    return `This action updates a #${id} favoriteProperty`;
  }

  remove(id: number) {
    return `This action removes a #${id} favoriteProperty`;
  }
}
