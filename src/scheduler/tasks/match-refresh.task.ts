import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import { MatchesService } from '../../matches/matches.service';

@Injectable()
export class MatchRefreshTask {
  private readonly logger = new Logger(MatchRefreshTask.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private matchesService: MatchesService,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Starting daily match refresh for active projects...');

    try {
      const activeProjects = await this.projectsRepository.find({
        where: { status: ProjectStatus.ACTIVE },
      });

      this.logger.log(
        `Found ${activeProjects.length} active projects to refresh`,
      );

      for (const project of activeProjects) {
        try {
          await this.matchesService.rebuildMatchesForProject(project.id);
          this.logger.log(`Refreshed matches for project ${project.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to refresh matches for project ${project.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('Daily match refresh completed');
    } catch (error) {
      this.logger.error(`Failed to refresh matches: ${error.message}`);
      throw error;
    }
  }
}
