import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralAreaDto } from './create-general-area.dto';

export class UpdateGeneralAreaDto extends PartialType(CreateGeneralAreaDto) {
    area: string
}
