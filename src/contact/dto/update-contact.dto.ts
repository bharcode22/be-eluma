import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactStatus } from '@prisma/client';

export class UpdateContactDto {
    @IsString()
    @IsOptional()
    number?: string;

    @IsEnum(ContactStatus)
    @IsOptional()
    status?: ContactStatus;
}
