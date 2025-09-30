import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateUsersManagementDto } from './dto/create-users-management.dto';
import { UpdateUsersManagementDto } from './dto/update-users-management.dto';
import { UsersManagementService } from './users-management.service';

@Controller('users-management')
export class UsersManagementController {
  constructor(private readonly usersManagementService: UsersManagementService) {}

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.usersManagementService.getAllUsers();

      return res.status(HttpStatus.OK).json({
        message: "success to get all users", 
        data: data
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create property',
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersManagementDto: UpdateUsersManagementDto) {
    return this.usersManagementService.update(+id, updateUsersManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersManagementService.remove(+id);
  }
}
