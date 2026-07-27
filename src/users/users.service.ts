import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<User[]> {
        const findAllUsers = await this.prisma.user.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        return findAllUsers;
    }

    async addUser(data: CreateUserDto): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const userInput = await this.prisma.user.create({
            data: {
                username: data.username,
                name: data.name,
                email: data.email,
                password: hashedPassword,
            }
        });

        return userInput;
    }

    async findProfile(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!user) {
            throw new NotFoundException('User profile not found');
        }

        return user;
    }

    async updateProfile(id: string, data: UpdateUserDto) {
        const existingUser = await this.prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.username) updateData.username = data.username;
        if (data.email) updateData.email = data.email;

        if (data.password && data.password.trim() !== '') {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(data.password, saltRounds);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
            }
        });

        return updatedUser;
    }
}