import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class SearchResearchDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  projectId?: number;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  skip?: number = 0;
}
