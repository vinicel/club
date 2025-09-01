import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
    });
    return this.userRepository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.password === password; // Comparaison directe
  }
}
