import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum ServiceStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateServiceDto {
  @IsOptional()
  @IsString()
  type_id?: string;

  @IsOptional()
  @IsString()
  service_name?: string;

  @IsOptional()
  @IsString()
  service_type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ServiceStatusEnum)
  status?: ServiceStatusEnum;
}
