import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Properties, Prisma } from '@prisma/client';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

async create(body: CreatePropertyDto) {
  const createProperty = await this.prisma.properties.create({
    data: {
      id: body.id,
      user_id: body.user_id,
      type_id: body.type_id,
      property_tittle: body.property_tittle,
      description: body.description,
      number_of_bedrooms: body.number_of_bedrooms,
      number_of_bathrooms: body.number_of_bathrooms,
      maximum_guest: body.maximum_guest,
      minimum_stay: body.minimum_stay,
      price: body.price,
      monthly_price: body.monthly_price,
      yearly_price: body.yearly_price,

      location: body.location
        ? {
            create: {
              general_area: body.location.general_area,
              map_url: body.location.map_url,
              longitude: body.location.longitude,
              latitude: body.location.latitude,
            },
          }
        : undefined,

      availability: body.availability
        ? {
            create: {
              available_from: body.availability.available_from,
              available_to: body.availability.available_to,
            },
          }
        : undefined,

      facilities: body.facilities
      ? {
          create: {
            ...Object.fromEntries(
              Object.entries(body.facilities).map(([key, value]) => [key, value === true])
            ),
          },
        }
      : undefined,

      images: body.images?.length
        ? {
            create: body.images.map((img) => ({
              imagesUrl: img.imagesUrl,
              imageName: img.imageName,
            })),
          }
        : undefined,

      propertiesOwner: body.propertiesOwner
        ? {
            create: {
              ...body.propertiesOwner,
              phone: body.propertiesOwner.phone !== undefined ? body.propertiesOwner.phone.toString() : undefined,
              watsapp: body.propertiesOwner.watsapp !== undefined ? body.propertiesOwner.watsapp.toString() : undefined,
            },
          }
        : undefined,

      additionalDetails: body.additionalDetails
        ? {
            create: {
              ...body.additionalDetails,
            },
          }
        : undefined,
    },
    include: {
      location: true,
      availability: true,
      facilities: true,
      images: true,
      propertiesOwner: true,
      additionalDetails: true,
    },
  });

  return createProperty;
}

  async findAll(): Promise<Prisma.PropertiesGetPayload<{
    include: {
      location: true,
      availability: true,
      facilities: true,
      images: true,
      propertiesOwner: true,
      additionalDetails: true
    }
  }>[]> {
    const getAllProperty = await this.prisma.properties.findMany({
      include: {
        location: true,
        availability: true,
        facilities: true,
        images: true,
        propertiesOwner: true,
        additionalDetails: true
      }
    });

    return getAllProperty;
  }

  async findOne(id: string): Promise<Prisma.PropertiesGetPayload<{
    include: {
      location: true,
      availability: true,
      facilities: true,
      images: true,
      propertiesOwner: true,
      additionalDetails: true
    }
  }>[]> {
    const getPropertyById = await this.prisma.properties.findUnique({
      where: {
        id: id
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

    return [getPropertyById];
  }

  async findMyProperty(user_id: string): Promise<Prisma.PropertiesGetPayload<{
    include: {
      location: true,
      availability: true,
      facilities: true,
      images: true,
      propertiesOwner: true,
      additionalDetails: true
    }
  }>[]> {
    const getAllProperty = await this.prisma.properties.findMany({
      where: {
        user_id: user_id
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

    return getAllProperty;
  }

  async findByType(type_id: string): Promise<Prisma.PropertiesGetPayload<{
    include: {
      location: true,
      availability: true,
      facilities: true,
      images: true,
      propertiesOwner: true,
      additionalDetails: true
    }
  }>[]> {
    const findByType = await this.prisma.properties.findMany({
      where: {
        type_id: type_id
      }, 
        include: {
          location: true,
          availability: true,
          facilities: true,
          images: true,
          propertiesOwner: true,
          additionalDetails: true
      }
    })
    return findByType;
  }

  // async showImage(imagesName: string){
  //   const showImage = await this.prisma.images.findMany({
  //     where: {
  //       imageName: imagesName 
  //     }
  //   })
  //   return showImage;
  // }

  update(id: number, body: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
