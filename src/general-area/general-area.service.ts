import { Injectable } from '@nestjs/common';
import { CreateGeneralAreaDto } from './dto/create-general-area.dto';
import { UpdateGeneralAreaDto } from './dto/update-general-area.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GeneralAreaService {
  constructor(private prisma: PrismaService) {}

  async create(create: CreateGeneralAreaDto) {
    const createGenralArea = await this.prisma.genral_area.create({
      data: create
    })
    return createGenralArea;
  }

  async findAll() {
    const getAllGenralArea = await this.prisma.genral_area.findMany({
    })

    return getAllGenralArea;
  }

  async findOne(id: string) {
    const getGenralAreaById = await this.prisma.genral_area.findUnique({
      where: {
        id: id
      }
    }) 
    return getGenralAreaById;
  }

  async update(id: string, update: UpdateGeneralAreaDto) {
    const updateGenralArea = await this.prisma.genral_area.update({
      where: {
        id: id
      },
      data: update
    })
    return updateGenralArea;
  }

  async remove(id: string) {
    const removeGeneralArea = await this.prisma.genral_area.delete({
      where: {
        id: id
      }
    })
    return removeGeneralArea;
  }
}
