import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        const findAllUsers = await this.prisma.user.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        return findAllUsers
    }

    async addUser(data: CreateUserDto): Promise<User>{
        const userInput = await this.prisma.user.create({
            data: {
                username      : data.username,
                name          : data.name,
                email         : data.email,
                password      : data.password,
            }
        })

        return userInput
    }
}