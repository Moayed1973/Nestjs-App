import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../matches/entities/match.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { ResearchService } from '../research/research.service';
import { UserEntity } from 'src/auth/entities/user.entity';

interface TopVendor {
  vendor_id: number;
  vendor_name: string;
  avg_score: number;
  total_matches: number;
}

export interface CountryAnalytics {
  country: string;
  top_vendors: TopVendor[];
  research_document_count: number;
}

interface rawData {
  country: string;
  vendor_id: number;
  vendor_name: string;
  avg_score: string;
  total_matches: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    private researchService: ResearchService,
  ) {}

  async getTopVendorsByCountry(user: UserEntity): Promise<CountryAnalytics[]> {
    // Get top vendors from MySQL (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topVendorsQuery = await this.matchesRepository
      .createQueryBuilder('match')
      .select('vendor.countries_supported', 'country')
      .addSelect('vendor.id', 'vendor_id')
      .addSelect('vendor.name', 'vendor_name')
      .addSelect('AVG(match.score)', 'avg_score')
      .addSelect('COUNT(match.id)', 'total_matches')
      .innerJoin('match.vendor', 'vendor')
      .where('match.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .groupBy('vendor.countries_supported')
      .addGroupBy('vendor.id')
      .addGroupBy('vendor.name')
      .having('COUNT(match.id) >= 1')
      .orderBy('country')
      .addOrderBy('avg_score', 'DESC')
      .getRawMany();

    // Group by country and take top 3 vendors per country
    const vendorsByCountry = this.groupTopVendorsByCountry(topVendorsQuery);

    // Get research document counts from MongoDB
    const result: CountryAnalytics[] = [];

    for (const [country, vendors] of Object.entries(vendorsByCountry)) {
      const researchCount = await this.researchService.countByCountry(
        country,
        user,
      );

      result.push({
        country,
        top_vendors: vendors.slice(0, 3), // Top 3 vendors
        research_document_count: researchCount,
      });
    }

    return result;
  }

  private groupTopVendorsByCountry(
    rawData: rawData[],
  ): Record<string, TopVendor[]> {
    const grouped: Record<string, TopVendor[]> = {};

    for (const row of rawData) {
      const countries = row.country.split(',').map((c: string) => c.trim());

      for (const country of countries) {
        if (!grouped[country]) {
          grouped[country] = [];
        }

        grouped[country].push({
          vendor_id: row.vendor_id,
          vendor_name: row.vendor_name,
          avg_score: parseFloat(row.avg_score),
          total_matches: parseInt(row.total_matches),
        });
      }
    }

    // Sort vendors by score within each country
    for (const country of Object.keys(grouped)) {
      grouped[country].sort((a, b) => b.avg_score - a.avg_score);
    }

    return grouped;
  }
}
