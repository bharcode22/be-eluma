import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Req, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PropertyService } from './property.service';
import { PropertyImagesInterceptor } from './property-images.interceptor'
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Response, Request } from 'express';
import * as multer from 'multer';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Roles('user')
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(PropertyImagesInterceptor())
  async create( @Body() body: any, @Req() req: Request, @Res() res: Response, @UploadedFiles() files: multer.File[] ) {
    try {
      const user = req.user as { id: string };

      const parsedBody = {
        ...body,
        user_id: user.id,
        number_of_bedrooms: parseInt(body.number_of_bedrooms),
        number_of_bathrooms: parseInt(body.number_of_bathrooms),
        maximum_guest: parseInt(body.maximum_guest),
        minimum_stay: parseInt(body.minimum_stay),
        price: parseFloat(body.price),
        monthly_price: parseFloat(body.monthly_price),
        yearly_price: parseFloat(body.yearly_price),
        location: body.location ? JSON.parse(body.location) : undefined,
        availability: body.availability ? JSON.parse(body.availability) : undefined,
        facilities: body.facilities ? JSON.parse(body.facilities) : undefined,
        propertiesOwner: body.propertiesOwner ? JSON.parse(body.propertiesOwner) : undefined,
        // additionalDetails: body.additionalDetails ? JSON.parse(body.additionalDetails) : undefined,
        images: files.map((file) => ({
          imagesUrl: `/propertyImages/${file.filename}`,
          imageName: file.filename
        })),
      };

      const property = await this.propertyService.create(parsedBody);

      return res.status(HttpStatus.OK).json({
        message: 'success to add new property',
        data: property,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create property',
        error: error.message,
      });
    }
  }

  // @Roles('user')
  // @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() res: Response) {
    try {
      const getAllProprties = await this.propertyService.findAll();

      if (getAllProprties.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "property not found, empty at database"
        })
      }

      const formatData = getAllProprties.map(data => ({
        id                  : data.id, 
        user_id             : data.user_id, 
        type_id             : data.type_id, 
        property_tittle     : data.property_tittle, 
        description         : data.description,  
        number_of_bedrooms  : data.number_of_bathrooms, 
        number_of_bathrooms : data.number_of_bathrooms, 
        maximum_guest       : data.maximum_guest, 
        minimum_stay        : data.minimum_stay, 
        price               : data.price,
        monthly_price       : data.monthly_price, 
        yearly_price        : data.yearly_price, 

        location            : data.location,
        availability        : data.availability,
        facilities          : data.facilities,
        images              : data.images,
        propertiesOwner     : data.propertiesOwner,
        additionalDetails   : data.additionalDetails,
      }));

      return res.status(HttpStatus.OK).json({
        message: 'Success to get all property data',
        totalData: formatData.length, 
        data: formatData,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get property data',
        error: error.message,
      });
    }
  } 

  @Get('/:id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const getAllProprties = await this.propertyService.findOne(id.toString());

      if (getAllProprties.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "property not found, empty at database"
        })
      }

      const formatData = getAllProprties.map(data => ({
        id                  : data.id, 
        user_id             : data.user_id, 
        type_id             : data.type_id, 
        property_tittle     : data.property_tittle, 
        description         : data.description,  
        number_of_bedrooms  : data.number_of_bathrooms, 
        number_of_bathrooms : data.number_of_bathrooms, 
        maximum_guest       : data.maximum_guest, 
        minimum_stay        : data.minimum_stay, 
        price               : data.price,
        monthly_price       : data.monthly_price, 
        yearly_price        : data.yearly_price, 

        location            : data.location,
        availability        : data.availability,
        facilities          : data.facilities,
        images              : data.images,
        propertiesOwner     : data.propertiesOwner,
        additionalDetails   : data.additionalDetails,
      }));

      return res.status(HttpStatus.OK).json({
        message: 'Success to get property by id',
        totalData: formatData.length, 
        data: formatData,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get property data',
        error: error.message,
      });
    }
  } 

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get('/my/property')
  async findMyProperty(@Res() res: Response, @Req() req: Request) {
    try {
      const user = req.user as { id: string };
      const user_id = user.id
      const getAllProprties = await this.propertyService.findMyProperty(user_id);

      if (getAllProprties.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "property not found, empty at database"
        })
      }

      const formatData = getAllProprties.map(data => ({
        id                  : data.id, 
        user_id             : data.user_id, 
        type_id             : data.type_id, 
        property_tittle     : data.property_tittle, 
        description         : data.description,  
        number_of_bedrooms  : data.number_of_bathrooms, 
        number_of_bathrooms : data.number_of_bathrooms, 
        maximum_guest       : data.maximum_guest, 
        minimum_stay        : data.minimum_stay, 
        price               : data.price,
        monthly_price       : data.monthly_price, 
        yearly_price        : data.yearly_price, 

        location            : data.location,
        availability        : data.availability,
        facilities          : data.facilities,
        images              : data.images,
        propertiesOwner     : data.propertiesOwner,
        additionalDetails   : data.additionalDetails,
      }))

      return res.status(HttpStatus.OK).json({
        message: "success to get my property", 
        totalData: formatData.length, 
        data: formatData, 
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to add users data',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get('/type/:type_id')
  async findOneByType(@Param('type_id') type_id: string, @Res() res: Response) {
    const getByType = await this.propertyService.findByType(type_id);

      const formatData = getByType.map(data => ({
        id                  : data.id, 
        user_id             : data.user_id, 
        type_id             : data.type_id, 
        property_tittle     : data.property_tittle, 
        description         : data.description,  
        number_of_bedrooms  : data.number_of_bathrooms, 
        number_of_bathrooms : data.number_of_bathrooms, 
        maximum_guest       : data.maximum_guest, 
        minimum_stay        : data.minimum_stay, 
        price               : data.price,
        monthly_price       : data.monthly_price, 
        yearly_price        : data.yearly_price, 

        location            : data.location,
        availability        : data.availability,
        facilities          : data.facilities,
        images              : data.images,
        propertiesOwner     : data.propertiesOwner,
        additionalDetails   : data.additionalDetails,
      }))

      return res.status(HttpStatus.OK).json({
        message: "success to get all property by type", 
        totalData: formatData.length, 
        data: formatData, 
      })
  }

  // @Roles('user')
  // @UseGuards(AuthGuard)
  // @Get('propertyImages')
  // async showImages(@Query('url') imagesUrl: string, @Res() res: Response) {
  //   const showImageProperty = await this.propertyService.showImage(imagesUrl);

  //   return res.status(HttpStatus.OK).json({
  //     message: "success to get image info", 
  //     data: showImageProperty
  //   });
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePropertyDto) {
    return this.propertyService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
