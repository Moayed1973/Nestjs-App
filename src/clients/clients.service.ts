import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCompany } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientCompany)
    private clientsRepository: Repository<ClientCompany>,
  ) {}

  // Create a new client
  async create(createClientDto: CreateClientDto): Promise<ClientCompany> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  // Get all clients
  async findAll(): Promise<ClientCompany[]> {
    return this.clientsRepository.find();
  }

  // Get one client by ID
  async findOne(id: number): Promise<ClientCompany> {
    const client = await this.clientsRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  // Update a client
  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientCompany> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    return this.clientsRepository.save(client);
  }

  // Delete a client
  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientsRepository.remove(client);
  }
}
