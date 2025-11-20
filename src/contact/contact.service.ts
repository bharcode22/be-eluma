import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async createContact(createContactDto: CreateContactDto) {
    const createContact = await this.prisma.contact.create({
      data: createContactDto
    })

    return createContact;
  }

  async getAllContact() {
    const getContact = await this.prisma.contact.findMany({})

    return getContact;
  }

  async getContact() {
    const getContact = await this.prisma.contact.findMany({
      where: {
        status: 'active'
      }
    })

    return getContact;
  }

  async findOne(id: string) {
    const getContactById = await this.prisma.contact.findMany({
      where: {
        id: id
      }
    })

    return getContactById;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const updateContact = await this.prisma.contact.update({
      where: {
        id: id
      }, 
      data: updateContactDto
    })

    return updateContact;
  }

  async remove(id: string) {
    const deleteContact = await this.prisma.contact.delete({
      where: {
        id: id
      }
    })
    return deleteContact;
  }
}
