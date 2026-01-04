import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { Roles } from '../auth/guard/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Response, Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createContactDto: CreateContactDto, @Res() res: Response) {
    try {
      const createContact = await this.contactService.createContact(createContactDto)

      return res.status(HttpStatus.OK).json({
        message: "success to create contact", 
        data: createContact
      });

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contact',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get('/all')
  async getAllContact(@Res() res: Response) {
    try {
      const contactData = await this.contactService.getAllContact();

      return  res.status(HttpStatus.OK).json({
        message: "success to get all contact", 
        totalData: contactData.length, 
        data: contactData
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contact',
        error: error.message,
      });
    }
  }

  @Get()
  async getContact(@Res() res: Response) {
    try {
      const contactData = await this.contactService.getContact();

      return  res.status(HttpStatus.OK).json({
        message: "success to get contact data", 
        data: contactData
      })

    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contact',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const getContactById = await this.contactService.findOne(id);
      
      return res.status(HttpStatus.OK).json({
        message: "success to get contact by id", 
        data: getContactById
      })
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to get contact',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Res() res: Response) {
    try {
      const updateContact = await this.contactService.update(id, updateContactDto);
      return res.status(HttpStatus.OK).json({
        message: "contact updated", 
        data: updateContact
      })
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed update contact',
        error: error.message,
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const deleteContact = await this.contactService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: "success to delete contact", 
        data: deleteContact
      })
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed update contact',
        error: error.message,
      });
    }
  }
}
