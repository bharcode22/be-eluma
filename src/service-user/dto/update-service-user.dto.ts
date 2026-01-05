import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceUserDto } from './create-service-user.dto';

export class UpdateServiceUserDto extends PartialType(CreateServiceUserDto) {}
