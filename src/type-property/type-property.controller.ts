import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TypePropertyService } from './type-property.service';
import { CreateTypePropertyDto } from './dto/create-type-property.dto';
import { UpdateTypePropertyDto } from './dto/update-type-property.dto';
import { Response } from 'express';

@Controller('type-property')
export class TypePropertyController {
  constructor(private readonly typePropertyService: TypePropertyService) {}

  @Post()
  async create(@Body() body: CreateTypePropertyDto, @Res() res: Response) {
    try {
      const createPropertyType = await this.typePropertyService.createType(body); 

      const formatData = {
        type_name: createPropertyType.type_name
      };

      return res.status(HttpStatus.OK).json({
        message: "success to create type data", 
        data: formatData
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to add type data',
        error: error.message,
      });
    }
  }
  
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const getTypeData = await this.typePropertyService.findAll()

      if (getTypeData.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "proprty type data not found"
        })
      }

      const formatData = getTypeData.map(data => ({
        id: data.id, 
        type_name: data.type_name
      }))

      return res.status(HttpStatus.OK).json({
        message: "successt to get all type data",
        data: formatData
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to get type data',
        error: error.message,
      });
    }
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const getTypeById = await this.typePropertyService.findOne(id)
      if (id.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "id at parans not found"
        })
      }
      
      const formatData = {
        id: getTypeById[0].id, 
        type_name: getTypeById[0].type_name
      }
      
      return res.status(HttpStatus.OK).json({
        message: "success to get data by id", 
        data: formatData
      });
      
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to get type data',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypePropertyDto: UpdateTypePropertyDto) {
    return this.typePropertyService.update(+id, updateTypePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typePropertyService.remove(+id);
  }
}
