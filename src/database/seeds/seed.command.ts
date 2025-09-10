import { Command, Console } from 'nestjs-console';
import { SeederService } from './seeder.service';

@Console()
export class SeedCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'seed:db',
    description: 'Seed the database with sample data',
  })
  async seed() {
    console.log('Starting database seeding...');
    await this.seederService.seed();
    console.log('Database seeding completed!');
  }

  @Command({
    command: 'seed:clear',
    description: 'Clear all database data',
  })
  async clear() {
    console.log('Clearing database...');
    // You can implement clear logic here
    console.log('Database cleared!');
  }
}
