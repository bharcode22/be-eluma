import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFavoritePropertyDto {
    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    property_id?: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;
}
