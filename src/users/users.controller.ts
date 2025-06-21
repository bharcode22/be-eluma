import { Controller, Get, Res,  Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll()

            if (!users || users.length === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "data not found", 
                    data: users
                })
            }

            const formatData = users.map(user => ({
                id       : user.id,
                name     : user.name,
                email    : user.email,
            }))

            return res.status(HttpStatus.OK).json({
                message: "Success to get data by admin",
                data: formatData
            })

        } catch (error: any) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Failed to get all data',
                error: error.message,
            });
        }
    }
}
