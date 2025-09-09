import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  countries_supported: string[];

  @IsArray()
  @IsString({ each: true })
  services_offered: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  response_sla_hours?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
