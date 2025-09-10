import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCompany } from '../../clients/entities/client.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import { User, UserRole } from '../../auth/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';
import {
  sampleClients,
  sampleVendors,
  sampleProjects,
} from './data/sample-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(ClientCompany)
    private clientsRepository: Repository<ClientCompany>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async seed() {
    this.logger.log('Starting database seeding...');

    try {
      // Clear existing data (optional - careful in production!)
      await this.clearDatabase();

      // Seed in correct order to maintain relationships
      const clients = await this.seedClients();
      await this.seedUsers(clients);
      const vendors = await this.seedVendors();
      const projects = await this.seedProjects(clients);

      this.logger.log('Database seeding completed successfully!');

      // Log what was created for verification
      this.logger.log(
        `Created: ${clients.length} clients, ${vendors.length} vendors, ${projects.length} projects`,
      );

      return true;
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  private async clearDatabase() {
    this.logger.log('Clearing existing data...');

    try {
      // Clear in reverse order of dependencies with proper criteria
      await this.matchesRepository.createQueryBuilder().delete().execute();
      await this.projectsRepository.createQueryBuilder().delete().execute();
      await this.vendorsRepository.createQueryBuilder().delete().execute();
      await this.usersRepository.createQueryBuilder().delete().execute();
      await this.clientsRepository.createQueryBuilder().delete().execute();

      this.logger.log('Database cleared successfully');
    } catch (error) {
      // If tables don't exist yet (first run), that's fine
      if (error.message.includes("doesn't exist")) {
        this.logger.log('Tables not found, skipping clear (first run)');
      } else {
        throw error;
      }
    }
  }

  private async seedClients(): Promise<ClientCompany[]> {
    this.logger.log('Seeding clients...');

    const clients = await this.clientsRepository.save(
      sampleClients.map((client) => this.clientsRepository.create(client)),
    );

    this.logger.log(`Created ${clients.length} clients`);
    return clients;
  }

  private async seedUsers(clients: ClientCompany[]) {
    this.logger.log('Seeding users...');

    const saltRounds = 10;

    const users = [
      // Admin user
      this.usersRepository.create({
        email: 'admin@user.com',
        password: await bcrypt.hash('adminpassword', saltRounds),
        role: UserRole.Admin,
        companyId: null,
      }),
      // Company users - one for each client
      this.usersRepository.create({
        email: 'techcorp@user.com',
        password: await bcrypt.hash('companypassword', saltRounds),
        role: UserRole.CompanyUser,
        companyId: clients[0].id,
      }),
      this.usersRepository.create({
        email: 'globalstartup@user.com',
        password: await bcrypt.hash('companypassword', saltRounds),
        role: UserRole.CompanyUser,
        companyId: clients[1].id,
      }),
      this.usersRepository.create({
        email: 'innovatelabs@user.com',
        password: await bcrypt.hash('companypassword', saltRounds),
        role: UserRole.CompanyUser,
        companyId: clients[2].id,
      }),
    ];

    await this.usersRepository.save(users);
    this.logger.log(`Created ${users.length} users`);
  }

  private async seedVendors(): Promise<Vendor[]> {
    this.logger.log('Seeding vendors...');

    const vendors = await this.vendorsRepository.save(
      sampleVendors.map((vendor) => this.vendorsRepository.create(vendor)),
    );

    this.logger.log(`Created ${vendors.length} vendors`);
    return vendors;
  }

  private async seedProjects(clients: ClientCompany[]): Promise<Project[]> {
    this.logger.log('Seeding projects...');

    // Map sample projects to use actual client IDs
    const projectsToCreate = sampleProjects.map((project, index) => {
      const client = clients[index % clients.length]; // Distribute projects among clients
      return this.projectsRepository.create({
        ...project,
        company: client,
        status: project.status as ProjectStatus,
      });
    });

    const projects = await this.projectsRepository.save(projectsToCreate);
    this.logger.log(`Created ${projects.length} projects`);
    return projects;
  }

  // Optional: Method to seed matches as well
  seedMatches() {
    this.logger.log('Seeding matches...');

    // This would require your matches service to generate matches
    // You can call your existing matching logic here
    this.logger.log(
      'Matches will be generated automatically when projects are accessed',
    );
  }
}
