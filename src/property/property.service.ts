import { Injectable, NotFoundException  } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Properties, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

async create(body: CreatePropertyDto) {
    const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const code = `${letters}${numbers}`;

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
      property_code: code,

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
      where: {
        isPublic: true, 
        deleted_at: null
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
        id: id, 
        deleted_at: null
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
        user_id: user_id, 
        isPublic: true, 
        deleted_at: null
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

  async findMyPrivateProperty(user_id: string): Promise<Prisma.PropertiesGetPayload<{
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
        user_id: user_id, 
        isPublic: false, 
        deleted_at: null
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
        type_id: type_id, 
        isPublic: true, 
        deleted_at: null
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

  async update(id: string, userId: string, body: UpdatePropertyDto) {
        // Cek apakah property ada
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Cek apakah ada gambar baru
    if (body.images?.length) {
      // Hapus file gambar lama
      for (const image of property.images) {
        const imagePath = path.join(__dirname, '..', '..', '..', 'propertyImages', image.imageName);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (err: any) {
            console.error(`Gagal menghapus gambar ${image.imageName}:`, err.message);
          }
        }
      }

      // Hapus gambar di DB
      await this.prisma.images.deleteMany({ where: { property_id: id } });
    }

    // Buat ulang images (hanya jika ada gambar baru)
    const imagesUpdate = body.images?.length
      ? {
          create: body.images.map((img) => ({
            imagesUrl: img.imagesUrl,
            imageName: img.imageName,
          })),
        }
      : undefined;

    // Hapus semua relasi one-to-many lama
    await this.prisma.additionalDetails.deleteMany({ where: { property_id: id } });
    await this.prisma.propertiesOwner.deleteMany({ where: { property_id: id } });
  
    // Hapus relasi one-to-one lama
    await this.prisma.location.deleteMany({ where: { property_id: id } });
    await this.prisma.availability.deleteMany({ where: { property_id: id } });
    await this.prisma.facilities.deleteMany({ where: { property_id: id } });

    // Buat ulang location
    const locationUpdate = body.location
      ? {
          create: {
            general_area: body.location.general_area,
            map_url: body.location.map_url,
            longitude: body.location.longitude,
            latitude: body.location.latitude,
          },
        }
      : undefined;
  
    // Buat ulang availability
    const availabilityUpdate = body.availability
      ? {
          create: {
            available_from: body.availability.available_from,
            available_to: body.availability.available_to,
          },
        }
      : undefined;
  
    // Buat ulang facilities
    const facilitiesUpdate = body.facilities
      ? {
          create: {
            ...Object.fromEntries(
              Object.entries(body.facilities).map(([key, value]) => [key, value === true])
            ),
          },
        }
      : undefined;
  
    // Buat ulang propertiesOwner (karena one-to-many tapi hanya satu)
    const propertiesOwnerUpdate = body.propertiesOwner
      ? {
          create: {
            ...body.propertiesOwner,
            phone: body.propertiesOwner.phone?.toString(),
            watsapp: body.propertiesOwner.watsapp?.toString(),
          },
        }
      : undefined;
  
    // Buat ulang additionalDetails
    const additionalDetailsUpdate = body.additionalDetails?.length
      ? {
          create: body.additionalDetails.map((detail: any) => ({
            ...detail,
          })),
        }
      : undefined;
  
    const { user_id, type_id, ...updateBody } = body;
  
    // Update property utama
    const updatedProperty = await this.prisma.properties.update({
      where: { id },
      data: {
        ...updateBody,
        images: imagesUpdate,
        location: locationUpdate,
        availability: availabilityUpdate,
        facilities: facilitiesUpdate,
        propertiesOwner: propertiesOwnerUpdate,
        additionalDetails: additionalDetailsUpdate,
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
  
    return updatedProperty;
  }

  async remove(id: string) {
    // Cek apakah property ada
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // for (const image of property.images) {
    //   const imagePath = path.join(__dirname, '..', '..', '..', 'propertyImages', image.imageName);
    //   if (fs.existsSync(imagePath)) {
    //     try {
    //       fs.unlinkSync(imagePath);
    //     } catch (err: any) {
    //     }
    //   } else {
    //   }
    // }

    const now = new Date();

    // Hapus semua relasi satu per satu
    await this.prisma.images.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    await this.prisma.location.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    await this.prisma.availability.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    await this.prisma.facilities.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    await this.prisma.propertiesOwner.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    await this.prisma.additionalDetails.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: now
      },
    });

    // Terakhir, hapus properti
    await this.prisma.properties.update({
      where: { id },
      data: {
        deleted_at: now
      }
    });

    return { message: `Property with ID ${id} has been deleted successfully` };
  }

  async hardDelete(id: string) {
    // Cek apakah property ada
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    for (const image of property.images) {
      const imagePath = path.join(__dirname, '..', '..', '..', 'propertyImages', image.imageName);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err: any) {
        }
      } else {
      }
    }

    // Hapus semua relasi satu per satu
    await this.prisma.images.deleteMany({
      where: { property_id: id },
    });

    await this.prisma.location.deleteMany({
      where: { property_id: id },
    });

    await this.prisma.availability.deleteMany({
      where: { property_id: id },
    });

    await this.prisma.facilities.deleteMany({
      where: { property_id: id },
    });

    await this.prisma.propertiesOwner.deleteMany({
      where: { property_id: id },
    });

    await this.prisma.additionalDetails.deleteMany({
      where: { property_id: id },
    });

    // Terakhir, hapus properti
    await this.prisma.properties.delete({
      where: { id },
    });

    return { message: `Property with ID ${id} has been hard deleted successfully` };
  }

  async restore(id: string) {
    // Cek apakah property ada
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Hapus semua relasi satu per satu
    await this.prisma.images.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    await this.prisma.location.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    await this.prisma.availability.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    await this.prisma.facilities.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    await this.prisma.propertiesOwner.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    await this.prisma.additionalDetails.updateMany({
      where: { property_id: id },
      data: {
        deleted_at: null
      },
    });

    // Terakhir, hapus properti
    await this.prisma.properties.update({
      where: { id },
      data: {
        deleted_at: null
      }
    });

    return { message: `Property with ID ${id} has been restored successfully` };
  }

  async togglePublicStatus(id: string) {
    const property = await this.prisma.properties.findUnique({
      where: { id },
      select: {
        isPublic: true
      }
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const newStatus = !property.isPublic;

    const updated = await this.prisma.properties.update({
      where: { id },
      data: {
        isPublic: newStatus
      }
    });

    return {
      message: `Property with ID ${id} has been ${newStatus ? 'public' : 'private'} successfully`,
      isPublic: updated.isPublic
    };
  }

  async updateImagesMany(
    propertyId: string,
    imagesData: { imagesUrl: string; imageName: string }[]
  ) {
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
      select: { id: true }
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Ambil daftar gambar lama dari DB
    const oldImages = await this.prisma.images.findMany({
      where: { property_id: propertyId }
    });

    // Buat set nama gambar untuk perbandingan
    const oldImageNames = new Set(oldImages.map(img => img.imageName));
    const newImageNames = new Set(imagesData.map(img => img.imageName));

    // 1️⃣ Hapus gambar yang tidak ada di upload baru
    const imagesToDelete = oldImages.filter(img => !newImageNames.has(img.imageName));
    if (imagesToDelete.length > 0) {
      // Hapus dari DB
      await this.prisma.images.deleteMany({
        where: {
          id: { in: imagesToDelete.map(img => img.id) }
        }
      });

      // Opsional: hapus file fisik
      imagesToDelete.forEach(img => {
        const filePath = path.join('./propertyImages', img.imageName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // 2️⃣ Update gambar yang sudah ada (jika URL berubah)
    for (const img of imagesData) {
      if (oldImageNames.has(img.imageName)) {
        await this.prisma.images.updateMany({
          where: { property_id: propertyId, imageName: img.imageName },
          data: {
            imagesUrl: img.imagesUrl,
            updated_at: new Date()
          }
        });
      }
    }

    // 3️⃣ Tambahkan gambar baru yang belum ada
    const imagesToAdd = imagesData.filter(img => !oldImageNames.has(img.imageName));
    if (imagesToAdd.length > 0) {
      await this.prisma.images.createMany({
        data: imagesToAdd.map(img => ({
          property_id: propertyId,
          imagesUrl: img.imagesUrl,
          imageName: img.imageName
        }))
      });
    }

    // Ambil data terbaru
    const updatedImages = await this.prisma.images.findMany({
      where: { property_id: propertyId }
    });

    return {
      message: 'Images updated successfully',
      total: updatedImages.length,
      images: updatedImages
    };
  }

  async getImagesByPropertyId(propertyId: string) {
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
      select: { id: true }
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    const images = await this.prisma.images.findMany({
      where: { property_id: propertyId },
      select: {
        id: true,
        imagesUrl: true,
        imageName: true,
        created_at: true,
        updated_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    return {
      message: `Found ${images.length} images for property ID ${propertyId}`,
      total: images.length,
      images
    };
  }
}
