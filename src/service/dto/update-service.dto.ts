import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @IsOptional()
    deleteImageIds?: any;
}
