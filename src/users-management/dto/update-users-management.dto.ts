import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersManagementDto } from './create-users-management.dto';

export class UpdateUsersManagementDto extends PartialType(CreateUsersManagementDto) {}
