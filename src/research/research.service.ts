import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Research, ResearchDocument } from './schemas/research.schema';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { SearchResearchDto } from './dto/search-research.dto';
import { ProjectsService } from '../projects/projects.service';
import { UserRole, UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel(Research.name) private researchModel: Model<ResearchDocument>,
    private projectsService: ProjectsService,
  ) {}

  async create(
    createResearchDto: CreateResearchDto,
    user: UserEntity,
  ): Promise<Research> {
    // Verify project exists and user has access
    const project = await this.projectsService.findOne(
      createResearchDto.projectId,
      user,
    );

    if (
      user.role === UserRole.CompanyUser &&
      project.company_id !== user.companyId
    ) {
      throw new ForbiddenException('Access denied');
    }

    const research = new this.researchModel(
      createResearchDto,
    ) as ResearchDocument;
    return research.save();
  }

  async findAll(user: UserEntity): Promise<Research[]> {
    let query = this.researchModel.find();

    if (user.role === UserRole.CompanyUser) {
      // Clients can only see research for their own projects
      const clientProjects = await this.projectsService.findAll(user);
      const projectIds = clientProjects.map((p) => p.id);
      query = query.where('projectId').in(projectIds);
    }

    return query.sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, user: UserEntity): Promise<ResearchDocument> {
    const research = await this.researchModel.findById(id).exec();

    if (!research) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    // Verify user has access to the project
    await this.projectsService.findOne(research.projectId, user);

    return research;
  }

  async update(
    id: string,
    updateResearchDto: UpdateResearchDto,
    user: UserEntity,
  ): Promise<Research> {
    const research = await this.findOne(id, user);

    if (
      updateResearchDto.projectId &&
      updateResearchDto.projectId !== research.projectId
    ) {
      await this.projectsService.findOne(updateResearchDto.projectId, user);
    }

    Object.assign(research, updateResearchDto);
    return research.save();
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    const research = await this.findOne(id, user);
    if (!research) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    await this.researchModel.findByIdAndDelete(id);
  }

  async search(
    searchResearchDto: SearchResearchDto,
    user: UserEntity,
  ): Promise<Research[]> {
    const { text, tags, projectId, limit, skip } = searchResearchDto;
    let query = this.researchModel.find();

    if (text) {
      query = query.find({ $text: { $search: text } });
    }

    if (tags && tags.length > 0) {
      query = query.where('tags').in(tags);
    }

    if (projectId) {
      await this.projectsService.findOne(projectId, user);
      query = query.where('projectId').equals(projectId);
    } else if (user.role === UserRole.CompanyUser) {
      const clientProjects = await this.projectsService.findAll(user);
      const projectIds = clientProjects.map((p) => p.id);
      query = query.where('projectId').in(projectIds);
    }

    return query
      .limit(limit)
      .skip(skip)
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .exec();
  }

  async countByProject(projectId: number, user: UserEntity): Promise<number> {
    // Verify user has access to the project
    await this.projectsService.findOne(projectId, user);

    return this.researchModel.countDocuments({ projectId }).exec();
  }

  async countByCountry(country: string, user: UserEntity): Promise<number> {
    const projectQuery: any = { country };

    if (user.role === UserRole.CompanyUser) {
      projectQuery.company_id = user.companyId;
    }

    // This would be more efficient with a proper join, but for simplicity:
    const projects = await this.projectsService.findAll(user);
    const projectIds = projects
      .filter((p) => p.country === country)
      .map((p) => p.id);

    if (projectIds.length === 0) return 0;

    return this.researchModel
      .countDocuments({
        projectId: { $in: projectIds },
      })
      .exec();
  }
}
