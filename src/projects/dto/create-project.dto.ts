import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsNumber()
  company_id: number;

  @IsString()
  country: string;

  @IsArray()
  @IsString({ each: true })
  services_needed: string[];

  @IsNumber()
  budget: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
