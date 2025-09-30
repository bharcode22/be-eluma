import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyManagementDto } from './create-property-management.dto';

export class UpdatePropertyManagementDto extends PartialType(CreatePropertyManagementDto) {}
