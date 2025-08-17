import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { FavoritePropertiesService } from './favorite-properties.service';
import { CreateFavoritePropertyDto } from './dto/create-favorite-property.dto';
import { UpdateFavoritePropertyDto } from './dto/update-favorite-property.dto';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Response, Request } from 'express';

@Controller('favorite-properties')
export class FavoritePropertiesController {
  constructor(private readonly favoritePropertiesService: FavoritePropertiesService) {}

  @Post(':property_id')
  @Roles('user')
  @UseGuards(AuthGuard)
  async create( @Param('property_id') property_id: string, @Body() createFavoritePropertyDto: CreateFavoritePropertyDto, @Res() res: Response, @Req() req: Request) {
    try {
      const user = req.user as { id: string };
      const user_id = user.id;

      const saveProp = await this.favoritePropertiesService.saveProperty(
        createFavoritePropertyDto,
        user_id,
        property_id
      );

      return res.status(HttpStatus.CREATED).json({
        message: 'success to save property',
        data: saveProp,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create property',
        error: error.message,
      });
    }
  }

  @Get()
  @Roles('user')
  @UseGuards(AuthGuard)
  async findAll(@Res() res: Response, @Req() req: Request) {
    try {
      const user = req.user as { id: string };
      const user_id = user.id;

      const data = await this.favoritePropertiesService.getMyFavProperties(user_id);
      const favId = data.map(item => item.id);
      const propertyIds = data.map(item => item.property_id);
      const propertiData = await this.favoritePropertiesService.getProperties(propertyIds);

      return res.status(HttpStatus.OK).json({
        user_id: user_id,
        fav_id: favId,  
        totalFavorites: propertyIds.length,
        data: propertiData,
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to save property',
        error: error.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritePropertiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoritePropertyDto: UpdateFavoritePropertyDto) {
    return this.favoritePropertiesService.update(+id, updateFavoritePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritePropertiesService.remove(+id);
  }
}
