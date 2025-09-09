import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserEntity } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProjectsService } from '../projects/projects.service';

@Controller('projects/:projectId/matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post('rebuild')
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async rebuildMatches(
    @Param('projectId') projectId: string,
    @GetUser() user: UserEntity,
  ) {
    const project = await this.projectsService.findOne(+projectId, user);
    if (
      user.role === UserRole.CompanyUser &&
      project.company_id !== user.companyId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.matchesService.rebuildMatchesForProject(+projectId);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.CompanyUser)
  async getMatches(
    @Param('projectId') projectId: string,
    @GetUser() user: UserEntity,
  ) {
    return this.matchesService.getProjectMatches(+projectId, user);
  }
}
