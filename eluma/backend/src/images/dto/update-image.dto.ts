import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
    property_id : string
    imagesUrl   : string 
    imageName   : string
}
