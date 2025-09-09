import { IsString, IsEmail, Length } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Length(1, 255)
  company_name: string;

  @IsEmail()
  @Length(1, 255)
  contact_email: string;
}
