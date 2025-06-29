import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
    type_id             : string
    property_tittle     : string 
    description         : string 
    number_of_bedrooms  : number 
    number_of_bathrooms : number
    maximum_guest       : number
    minimum_stay        : number 
    price               : number
    monthly_price       : number 
    yearly_price        : number 
}
