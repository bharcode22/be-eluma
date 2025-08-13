import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { GeneralAreaService } from './general-area.service';
import { CreateGeneralAreaDto } from './dto/create-general-area.dto';
import { UpdateGeneralAreaDto } from './dto/update-general-area.dto';
import { Response, Request } from 'express';

@Controller('general-area')
export class GeneralAreaController {
  constructor(private readonly generalAreaService: GeneralAreaService) {}

  @Post()
  async create(@Body() body: CreateGeneralAreaDto, @Req() req: Request, @Res() res: Response) {
    try {
      const createGeneralArea = await this.generalAreaService.create(body)

      const formatData = {
        area: createGeneralArea.area
      };

      return res.status(HttpStatus.OK).json({
        message: "success to add general area data", 
        data: formatData
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to add general area',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const getGeneralArea = await this.generalAreaService.findAll()
      
      const formatData = getGeneralArea.map(data => ({
        area: data.area
      }))

      return res.status(HttpStatus.OK).json({
        message: "success to get general area", 
        data: formatData
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to add general area',
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalAreaService.findOne((id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralAreaDto: UpdateGeneralAreaDto) {
    return this.generalAreaService.update(id, updateGeneralAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalAreaService.remove(id);
  }
}
