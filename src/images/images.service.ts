import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  async findAll() {
    const findAllImageData = await this.prisma.images.findMany({})

    return findAllImageData
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
