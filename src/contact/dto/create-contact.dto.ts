import { ContactStatus } from '@prisma/client';

export class CreateContactDto {
    number :string
    status : ContactStatus
}
