import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserEntity } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: UserEntity,
  ) {
    // Clients can only create projects for themselves
    if (user.role === UserRole.CompanyUser) {
      createProjectDto.company_id = user.companyId;
    }
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.projectsService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: UserEntity,
  ) {
    return this.projectsService.update(+id, updateProjectDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string, @GetUser() user: UserEntity) {
    return this.projectsService.remove(+id, user);
  }
}
