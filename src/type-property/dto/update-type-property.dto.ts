import { PartialType } from '@nestjs/mapped-types';
import { CreateTypePropertyDto } from './create-type-property.dto';

export class UpdateTypePropertyDto extends PartialType(CreateTypePropertyDto) {
    type_name: string
}
