import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { Response, Request } from 'express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PropertyOwnerService } from './property-owner.service';
import { CreatePropertyOwnerDto } from './dto/create-property-owner.dto';
import { UpdatePropertyOwnerDto } from './dto/update-property-owner.dto';

@Controller('property-owner')
export class PropertyOwnerController {
  constructor(private readonly propertyOwnerService: PropertyOwnerService) {}

  @Post()
  create(@Body() createPropertyOwnerDto: CreatePropertyOwnerDto) {
    return this.propertyOwnerService.create(createPropertyOwnerDto);
  }

  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard)
  async findAll(
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    try {
      const result = await this.propertyOwnerService.findAllOwner(
        Number(page),
        Number(limit),
        search,
      );

      return res.status(HttpStatus.OK).json({
        message: 'success to get owner data',
        ...result,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get owner data',
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyOwnerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyOwnerDto: UpdatePropertyOwnerDto) {
    return this.propertyOwnerService.update(+id, updatePropertyOwnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyOwnerService.remove(+id);
  }
}
