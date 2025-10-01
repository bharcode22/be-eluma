import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PropertyManagementService } from './property-management.service';
import { CreatePropertyManagementDto } from './dto/create-property-management.dto';
import { UpdatePropertyManagementDto } from './dto/update-property-management.dto';

@Controller('property-management')
export class PropertyManagementController {
  constructor(private readonly propertyManagementService: PropertyManagementService) {}

  @Post()
  create(@Body() createPropertyManagementDto: CreatePropertyManagementDto) {
    return this.propertyManagementService.create(createPropertyManagementDto);
  }

@Roles('admin')
@UseGuards(AuthGuard)
@Get()
async findAll(@Res() res: Response, @Req() req: Request) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const search = req.query.search as string | undefined;

    const result = await this.propertyManagementService.getAllProperty(page, limit, search);

    return res.status(HttpStatus.OK).json({
      message: "success to get all property",
      ...result, 
    });
  } catch (error: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to get property list',
      error: error.message,
    });
  }
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyManagementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyManagementDto: UpdatePropertyManagementDto) {
    return this.propertyManagementService.update(+id, updatePropertyManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyManagementService.remove(+id);
  }
}
