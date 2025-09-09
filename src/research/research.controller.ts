import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { SearchResearchDto } from './dto/search-research.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserEntity } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('research')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  create(
    @Body() createResearchDto: CreateResearchDto,
    @GetUser() user: UserEntity,
  ) {
    return this.researchService.create(createResearchDto, user);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.researchService.findAll(user);
  }

  @Get('search')
  search(
    @Query() searchResearchDto: SearchResearchDto,
    @GetUser() user: UserEntity,
  ) {
    return this.researchService.search(searchResearchDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.researchService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResearchDto: UpdateResearchDto,
    @GetUser() user: UserEntity,
  ) {
    return this.researchService.update(id, updateResearchDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.researchService.remove(id, user);
  }
}
