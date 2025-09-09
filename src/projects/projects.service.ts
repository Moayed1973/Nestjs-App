import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole, UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll(user: UserEntity): Promise<Project[]> {
    if (user.role === UserRole.Admin) {
      return this.projectsRepository.find({ relations: ['company'] });
    }

    // Clients can only see their own projects
    return this.projectsRepository.find({
      where: { company_id: user.companyId },
      relations: ['company'],
    });
  }

  async findOne(id: number, user: Partial<UserEntity>): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Authorization check - only need role and companyId
    if (
      user.role === UserRole.CompanyUser &&
      project.company_id !== user.companyId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: UserEntity,
  ): Promise<Project> {
    const project = await this.findOne(id, user);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    const project = await this.findOne(id, user);
    await this.projectsRepository.remove(project);
  }
}
