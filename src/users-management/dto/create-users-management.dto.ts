import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUsersManagementDto {
	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	password?: string;

	@IsOptional()
	@IsEnum(Role)
	role?: Role;

	@IsOptional()
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsString()
	provider?: string;
}
