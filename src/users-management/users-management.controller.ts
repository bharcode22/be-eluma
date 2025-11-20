import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateUsersManagementDto } from './dto/create-users-management.dto';
import { UpdateUsersManagementDto } from './dto/update-users-management.dto';
import { UsersManagementService } from './users-management.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('users-management')
export class UsersManagementController {
  constructor(private readonly usersManagementService: UsersManagementService) {}

@Roles('admin')
@UseGuards(AuthGuard)
@Get()
async findAll(@Res() res: Response, @Req() req: Request) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const search = req.query.search as string | undefined;

    const result = await this.usersManagementService.getAllUsers(page, limit, search);

    return res.status(HttpStatus.OK).json({
      message: 'Success to get all users',
      ...result,
    });
  } catch (error: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to get users',
      error: error.message,
    });
  }
}

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get('/propery/:id')
  async getProperyUser(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.usersManagementService.findDetailProperty(id);

      if(data.length < 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "data empty at database"
        })
      }

      return res.status(HttpStatus.OK).json({
        message: "success to get priperty by users", 
        totalData: data.length, 
        data: data
      })

    } catch (error: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to get detail property users',
      error: error.message,
    });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.usersManagementService.getUserById(id);

      return res.status(HttpStatus.OK).json({
        message: "success to get user by id", 
        data: data
      })

    } catch (error: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to get users by id',
      error: error.message,
    });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Post()
  async createUser(
    @Body() createUsersManagementDto: CreateUsersManagementDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.usersManagementService.createUser(createUsersManagementDto);
      return res.status(HttpStatus.OK).json({
        message: 'User created successfully',
        data: updated,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update user',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUsersManagementDto: UpdateUsersManagementDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.usersManagementService.updateUser(id, updateUsersManagementDto);
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully',
        data: updated,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update user',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersManagementService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to delete user',
        error: error.message,
      });
    }
  }
}
