import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('propertyImages')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const getAllImageData = await this.imagesService.findAll();

      if (getAllImageData.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "images data empty at database",
        })
      }

      const formatData = getAllImageData.map(data => ({
        id          : data.id, 
        property_id : data.property_id, 
        imagesUrl   : data.imagesUrl, 
        imageName   : data.imageName
      }))

    return res.status(HttpStatus.NOT_FOUND).json({
      message: "success to get all image data", 
      data: formatData
    })
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Failed get image data',
        error: error.message,
      });
    }
  }

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    try {
        const imagePath = path.join(__dirname, '..', '..', '..', 'propertyImages', imageName);

      if (!fs.existsSync(imagePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Image not found',
        });
      }

      return res.sendFile(imagePath);
    } catch (error: any) {
      console.error("Error sending image:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to show image data',
        error: error.message,
      });
    }
  }
}
