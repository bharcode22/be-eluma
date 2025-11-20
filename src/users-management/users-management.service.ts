import { Injectable } from '@nestjs/common';
import { CreateUsersManagementDto } from './dto/create-users-management.dto';
import { UpdateUsersManagementDto } from './dto/update-users-management.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersManagementService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    const enumRoles = ['admin', 'user'];
    const isRole = enumRoles.includes(search.toLowerCase());

    const where = {
      ...(search
        ? {
            OR: [
              { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              ...(isRole ? [{ role: search as any }] : []),
            ],
          }
        : {}),
      deleted_at: null,
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          role: true,
          created_at: true,
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async getUserById(id: string) {
    const getUserByIdData = await this.prisma.user.findFirst({
      where: {
        id: id
      }
    })

    const formatData = ({
      id              : getUserByIdData.id, 
      username        : getUserByIdData.username, 
      email           : getUserByIdData.email, 
      name            : getUserByIdData.name, 
      role            : getUserByIdData.role, 
      avatar          : getUserByIdData.avatar, 
      provider        : getUserByIdData.provider
    })

    return formatData;
  }

  async findDetailProperty(id: string) {
    const propertyByUsers = await this.prisma.properties.findMany({
      where: {
        user_id: id
      }, 
      include: {
        propertyType: true
      }, 
      orderBy: {
        created_at: 'desc'
      }
    })

    const formatData = propertyByUsers.map(data => ({
      id              : data.id, 
      property_tittle : data.property_tittle, 
      property_code   : data.property_code, 
      propertyType    : data.propertyType.type_name
    }))

    return formatData;
  }

  async createUser(updateUsersManagementDto: CreateUsersManagementDto) {
    const dataToUpdate: any = {
      ...updateUsersManagementDto,
      updated_at: new Date(),
    };

    const updatedUser = await this.prisma.user.create({
      data: dataToUpdate,
      select: {
        username: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        provider: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async updateUser(id: string, updateUsersManagementDto: UpdateUsersManagementDto) {
    const dataToUpdate: any = {
      ...updateUsersManagementDto,
      updated_at: new Date(),
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        provider: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const removed = await this.prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return removed;
  }
}
