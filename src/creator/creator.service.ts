import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creator } from './creator.entity';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { CreatorResponseDto } from './dto/creator-response.dto';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,
  ) {}

  async create(
    createCreatorDto: CreateCreatorDto,
  ): Promise<CreatorResponseDto> {
    const { username, monthlyPrice } = createCreatorDto;

    const existingCreator = await this.creatorRepository.findOne({
      where: { username },
    });

    if (existingCreator) {
      throw new ConflictException('Username already exists');
    }

    const creator = this.creatorRepository.create({
      username,
      monthlyPrice,
    });

    const savedCreator = await this.creatorRepository.save(creator);

    return {
      id: savedCreator.id,
      username: savedCreator.username,
      monthlyPrice: savedCreator.monthlyPrice,
    };
  }

  async findByUsername(username: string): Promise<CreatorResponseDto> {
    const creator = await this.creatorRepository.findOne({
      where: { username },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return {
      id: creator.id,
      username: creator.username,
      monthlyPrice: creator.monthlyPrice,
    };
  }

  async findById(id: string): Promise<CreatorResponseDto | null> {
    const creator = await this.creatorRepository.findOne({
      where: { id },
    });

    if (!creator) {
      return null;
    }

    return {
      id: creator.id,
      username: creator.username,
      monthlyPrice: creator.monthlyPrice,
    };
  }
}
