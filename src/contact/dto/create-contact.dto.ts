import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    number: string;

    @IsEnum(ContactStatus)
    @IsOptional()
    status?: ContactStatus;
}
