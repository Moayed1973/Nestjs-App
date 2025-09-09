import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { ClientCompany } from '../clients/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ClientCompany)
    private companiesRepository: Repository<ClientCompany>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result as Omit<User, 'password'>;
    }
    return null;
  }

  login(user: Omit<User, 'password'>) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  async register(
    email: string,
    password: string,
    role: UserRole = UserRole.CompanyUser,
    companyId?: number,
  ) {
    if (role === UserRole.CompanyUser) {
      if (!companyId) {
        throw new BadRequestException(
          'companyId is required for company users',
        );
      }

      const companyExists = await this.companiesRepository.findOne({
        where: { id: companyId },
      });

      if (!companyExists) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }
    }

    if (role === UserRole.Admin && companyId) {
      throw new BadRequestException(
        'companyId should not be provided for admin users',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      companyId,
    });

    return this.usersRepository.save(user);
  }
}
