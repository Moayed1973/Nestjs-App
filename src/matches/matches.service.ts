import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { ProjectsService } from '../projects/projects.service';
import { VendorsService } from '../vendors/vendors.service';
import { UserEntity, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    private projectsService: ProjectsService,
    private vendorsService: VendorsService,
  ) {}

  private calculateMatchScore(
    servicesOverlap: number,
    vendorRating: number,
    responseSlaHours: number,
  ): number {
    const SLA_WEIGHT = 48 / responseSlaHours;
    const rawScore = servicesOverlap * 2 + vendorRating + SLA_WEIGHT;

    return Math.round(rawScore * 100) / 100;
  }

  async rebuildMatchesForProject(projectId: number): Promise<Match[]> {
    try {
      // Get project with proper admin user object
      const adminUser = { role: UserRole.Admin } as const;
      const project = await this.projectsService.findOne(projectId, adminUser);

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      // Find compatible vendors
      const compatibleVendors =
        await this.vendorsService.findVendorsByCountryAndServices(
          project.country,
          project.services_needed,
        );

      const matches: Match[] = [];
      const vendorIds = compatibleVendors.map((v) => v.id);

      // Process each compatible vendor
      for (const vendor of compatibleVendors) {
        const servicesOverlap = project.services_needed.filter((service) =>
          vendor.services_offered.includes(service),
        ).length;

        const score = this.calculateMatchScore(
          servicesOverlap,
          vendor.rating,
          vendor.response_sla_hours,
        );

        // Find existing match or create new one
        let match = await this.matchesRepository.findOne({
          where: { project_id: projectId, vendor_id: vendor.id },
        });

        if (match) {
          // Update existing match
          match.score = score;
          match.is_notified = false;
        } else {
          // Create new match
          match = this.matchesRepository.create({
            project_id: projectId,
            vendor_id: vendor.id,
            score,
            is_notified: false,
          });
        }

        const savedMatch = await this.matchesRepository.save(match);
        matches.push(savedMatch);
      }

      // Remove matches for vendors that are no longer compatible
      if (vendorIds.length > 0) {
        await this.matchesRepository
          .createQueryBuilder()
          .delete()
          .from(Match)
          .where('project_id = :projectId', { projectId })
          .andWhere('vendor_id NOT IN (:...vendorIds)', { vendorIds })
          .execute();
      } else {
        // If no compatible vendors, delete all matches for this project
        await this.matchesRepository
          .createQueryBuilder()
          .delete()
          .from(Match)
          .where('project_id = :projectId', { projectId })
          .execute();
      }

      return matches;
    } catch (error) {
      throw new Error(
        `Failed to rebuild matches for project ${projectId}: ${error.message}`,
      );
    }
  }

  async getProjectMatches(
    projectId: number,
    user: UserEntity,
  ): Promise<Match[]> {
    await this.projectsService.findOne(projectId, user);

    return this.matchesRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }
}
