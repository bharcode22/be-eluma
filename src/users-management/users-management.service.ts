import { Injectable } from '@nestjs/common';
import { CreateUsersManagementDto } from './dto/create-users-management.dto';
import { UpdateUsersManagementDto } from './dto/update-users-management.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersManagementService {
    constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const data = await this.prisma.user.findMany({
      where: {
        deleted_at: null
      }, 
      select: {
        id: true, 
        username: true, 
        email: true, 
        name: true, 
        role: true, 
        created_at: true, 
      }
    })

    return data;
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
