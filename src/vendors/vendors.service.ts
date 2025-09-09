import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorsRepository.create(createVendorDto);
    return this.vendorsRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find();
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateVendorDto);
    return this.vendorsRepository.save(vendor);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorsRepository.remove(vendor);
  }

  async findVendorsByCountryAndServices(
    country: string,
    services: string[],
  ): Promise<Vendor[]> {
    const allActiveVendors = await this.vendorsRepository.find({
      where: { is_active: true },
    });

    const compatibleVendors = allActiveVendors.filter((vendor) => {
      const vendorCountries = vendor.countries_supported.map((c) =>
        c.trim().toLowerCase(),
      );

      const vendorServices = vendor.services_offered.map((s) =>
        s.trim().toLowerCase(),
      );

      const targetCountry = country.trim().toLowerCase();
      const targetServices = services.map((s) => s.trim().toLowerCase());

      // Check country support (case insensitive)
      const countrySupported = vendorCountries.includes(targetCountry);

      // Check service overlap (at least one service matches)
      const hasServiceOverlap = targetServices.some((neededService) =>
        vendorServices.includes(neededService),
      );
      return countrySupported && hasServiceOverlap;
    });

    return compatibleVendors;
  }
}
