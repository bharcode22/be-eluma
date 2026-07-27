import { Controller, Get, Res, Req, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Response, Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        try {
            const userId = (req as any).user.id;
            const profile = await this.usersService.findProfile(userId);

            return res.status(HttpStatus.OK).json({
                message: 'Success to get user profile',
                data: profile,
            });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get profile',
                error: error.message,
            });
        }
    }

    @UseGuards(AuthGuard)
    @Patch('profile')
    async updateProfile(@Req() req: Request, @Res() res: Response, @Body() body: UpdateUserDto) {
        try {
            const userId = (req as any).user.id;
            const updated = await this.usersService.updateProfile(userId, body);

            return res.status(HttpStatus.OK).json({
                message: 'Profile updated successfully',
                data: updated,
            });
        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to update profile',
                error: error.message,
            });
        }
    }

    @Roles('admin')
    @UseGuards(AuthGuard)
    @Get()
    async getAllUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll();

            if (!users || users.length === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "user data not found",
                    data: users
                });
            }

            const formatData = users.map(user => ({
                id           : user.id,
                username     : user.username,
                name         : user.name,
                email        : user.email,
                role         : user.role
            }));

            const totalUsers = formatData.length;

            return res.status(HttpStatus.OK).json({
                message: "Success to get data by admin",
                data: formatData,
                totalUsers: totalUsers
            });

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }

    @Roles('admin')
    @UseGuards(AuthGuard)
    @Post()
    async createUsers(@Res() res: Response, @Body() body: CreateUserDto) {
        try {
            const user = await this.usersService.addUser(body);

            const formatData = {
                id            : user.id,
                username      : user.username,
                name          : user.name,
                email         : user.email,
                role          : user.role
            };

            return res.status(HttpStatus.OK).json({
                message: "Success to create user by admin",
                data: formatData
            });

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to add users data',
                error: error.message,
            });
        }
    }
}
