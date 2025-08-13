import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Req, UseInterceptors, UploadedFiles, Query, Put } from '@nestjs/common';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { PropertyService } from './property.service';
import { PropertyImagesInterceptor } from './property-images.interceptor'
import { Response, Request } from 'express';
import * as multer from 'multer';

@Controller('property')
export class PropertyController {
  [x: string]: any;
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
        property_code       : data.property_code,
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
        property_code       : data.property_code,

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
        property_code       : data.property_code,

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
  @Get('/my/private')
  async findMyPrivateProperty(@Res() res: Response, @Req() req: Request) {
    try {
      const user = req.user as { id: string };
      const user_id = user.id
      const getAllProprties = await this.propertyService.findMyPrivateProperty(user_id);

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

  @Roles('user')
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(PropertyImagesInterceptor())
  async update( @Param('id') id: string, @Body() body: any, @Req() req: Request, @Res() res: Response, @UploadedFiles() files: multer.File[] ) {
    try {
      const user = req.user as { id: string };
      const userId = user?.id;
  
      const parsedBody = {
        ...body,
        number_of_bedrooms: body.number_of_bedrooms ? parseInt(body.number_of_bedrooms) : undefined,
        number_of_bathrooms: body.number_of_bathrooms ? parseInt(body.number_of_bathrooms) : undefined,
        maximum_guest: body.maximum_guest ? parseInt(body.maximum_guest) : undefined,
        minimum_stay: body.minimum_stay ? parseInt(body.minimum_stay) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        monthly_price: body.monthly_price ? parseFloat(body.monthly_price) : undefined,
        yearly_price: body.yearly_price ? parseFloat(body.yearly_price) : undefined,
        location:
          body.location && typeof body.location === 'string' ? JSON.parse(body.location) : body.location,
        availability:
          body.availability && typeof body.availability === 'string' ? JSON.parse(body.availability) : body.availability,
        facilities:
          body.facilities && typeof body.facilities === 'string' ? JSON.parse(body.facilities) : body.facilities,
        propertiesOwner:
          body.propertiesOwner && typeof body.propertiesOwner === 'string' ? JSON.parse(body.propertiesOwner) : body.propertiesOwner,
        additionalDetails:
          body.additionalDetails && typeof body.additionalDetails === 'string' ? JSON.parse(body.additionalDetails) : body.additionalDetails,
        images: files?.length
          ? files.map((file) => ({
              imagesUrl: `/propertyImages/${file.filename}`,
              imageName: file.filename,
            }))
          : body.images, // fallback
      };
  
      const updated = await this.propertyService.update(id, userId, parsedBody);
  
      return res.status(HttpStatus.OK).json({
        message: 'success to update property',
        data: updated,
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update property',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "property id is invalid"
        });
      }

      const deleteProperty = await this.propertyService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: "property deleted",
        data: deleteProperty
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to delete property type',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Put('/status/:id')
  async setToggleStatus(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "property id is invalid"
        });
      }

      const setProperty = await this.propertyService.togglePublicStatus(id);

      return res.status(HttpStatus.OK).json({
        message: "property seted",
        data: setProperty
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to set property status',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Put('/restore/:id')
  async restoreProperty(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "property id is invalid"
        });
      }

      const restoreProperty = await this.propertyService.restore(id);

      return res.status(HttpStatus.OK).json({
        message: "property restored",
        data: restoreProperty
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to restore property status',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Delete('/hard/delete/:id')
  async hardDeleteProperty(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "property id is invalid"
        });
      }

      const restoreProperty = await this.propertyService.hardDelete(id);

      return res.status(HttpStatus.OK).json({
        message: "property hard deleted",
        data: restoreProperty
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to restore property status',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Put('/update/property/:id/images')
  @UseInterceptors(PropertyImagesInterceptor())
  async updateImagesController(
    @Param('id') id: string,
    @UploadedFiles() files: multer.File[], 
    @Body('existingImages') existingImagesJson: string,
    @Res() res: Response
  ) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Property ID is invalid"
        });
      }

      // Parse data gambar lama dari body
      let existingImages: { imagesUrl: string; imageName: string }[] = [];
      if (existingImagesJson) {
        try {
          existingImages = JSON.parse(existingImagesJson);
        } catch (err) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: "Invalid existingImages format"
          });
        }
      }

      // Gabungkan gambar lama yang dipertahankan + gambar baru
      const newImages = files.map(file => ({
        imagesUrl: `/propertyImages/${file.filename}`,
        imageName: file.filename
      }));

      const allImages = [...existingImages, ...newImages];

      if (allImages.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "No images provided"
        });
      }

      // Update ke database
      const updatedImages = await this.propertyService.updateImagesMany(id, allImages);

      return res.status(HttpStatus.OK).json({
        message: "Property images updated successfully",
        data: updatedImages
      });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed to update property images',
        error: error.message,
      });
    }
  }

  @Roles('user')
  @UseGuards(AuthGuard)
  @Get('/:id/images')
  async getImagesController(@Param('id') id: string, @Res() res: Response) {
    try {
      if (!id || id.trim() === '') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Property ID is invalid"
        });
      }

      const images = await this.propertyService.getImagesByPropertyId(id);

      return res.status(HttpStatus.OK).json(images);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get images',
        error: error.message,
      });
    }
  }
}
