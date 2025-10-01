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

  findOne(id: number) {
    return `This action returns a #${id} usersManagement`;
  }

  update(id: number, updateUsersManagementDto: UpdateUsersManagementDto) {
    return `This action updates a #${id} usersManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersManagement`;
  }
}
