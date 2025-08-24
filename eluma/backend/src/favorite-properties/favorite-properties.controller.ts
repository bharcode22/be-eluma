import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { FavoritePropertiesService } from './favorite-properties.service';
import { CreateFavoritePropertyDto } from './dto/create-favorite-property.dto';
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

      const getFavExistProperty = await this.favoritePropertiesService.geteSaveFavProp(user_id, property_id)

      let result:  any = []
      if (getFavExistProperty.length > 0) {
        const unsaveProp = await this.favoritePropertiesService.removeSaveFavProp(
          user_id,
          property_id
        );

        result.push(unsaveProp)
      } else {
        const saveProp = await this.favoritePropertiesService.saveProperty(
          createFavoritePropertyDto,
          user_id,
          property_id
        );
        result.push(saveProp)
      }

      return res.status(HttpStatus.CREATED).json({
        message: 'fav properties success to proccessed',
        data: result,
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

      const favorites = await this.favoritePropertiesService.getMyFavProperties(user_id);

      const favMap = favorites.reduce((acc, fav) => {
        acc[fav.property_id] = fav.id;
        return acc;
      }, {} as Record<string, string>);

      const favId = favorites.map(item => item.id);
      const propertyIds = favorites.map(item => item.property_id);

      const propertiData = await this.favoritePropertiesService.getProperties(propertyIds);

      const mergedData = propertiData.map(property => ({
        fav_id: favMap[property.id] || null,
        ...property,
      }));

      return res.status(HttpStatus.OK).json({
        messgae: "success get saved property", 
        user_id,
        totalFavorites: propertyIds.length,
        data: mergedData,
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get favorite properties',
        error: error.message,
      });
    }
  }

  @Get(':property_id')
  @Roles('user')
  @UseGuards(AuthGuard)
  async isSaveFavProp(@Res() res: Response, @Req() req: Request, @Param('property_id') property_id: string,) {
    try {
      const user = req.user as { id: string };
      const user_id = user.id;

      const isFav = await this.favoritePropertiesService.isPropertySave(user_id, property_id);

      return res.status(HttpStatus.OK).json({
          status: isFav
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get favorite properties',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @Roles('user')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    try {
      const unsaveProperty = await this.favoritePropertiesService.remove(id); 

      return res.status(HttpStatus.OK).json({
        messgae: "success to unsave property", 
        data: unsaveProperty
      })
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get favorite properties',
        error: error.message,
      });
    }
  }
}
