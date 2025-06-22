import { Controller, Get, Res,  Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll()

            if (!users || users.length === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "user data not found", 
                    data: users
                })
            }

            const formatData = users.map(user => ({
                id           : user.id,
                username     : user.username,
                name         : user.name,
                email        : user.email,
                password     : user.password
            }))

            const totalUsers = formatData.length

            return res.status(HttpStatus.OK).json({
                message: "Success to get data by admin",
                data: formatData,
                totalUsers: totalUsers
            })

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }

    @Post()
    async createUsers(@Res() res: Response, @Body() body: CreateUserDto) {
        try {
            const user = await this.usersService.addUser(body)

            const formatData = {
                username      : user.username,
                name          : user.name,
                email         : user.email,
                password      : user.password,
            }

            return res.status(HttpStatus.OK).json({
                message: "Success to get data by admin",
                data: formatData
            })

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to add users data',
                error: error.message,
            });
        }
    }
}
