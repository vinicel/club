import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { CreatorResponseDto } from './dto/creator-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('creators')
@UseGuards(JwtAuthGuard)
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createCreatorDto: CreateCreatorDto,
  ): Promise<CreatorResponseDto> {
    return this.creatorService.create(createCreatorDto);
  }

  @Get(':username')
  getByUsername(
    @Param('username') username: string,
  ): Promise<CreatorResponseDto> {
    return this.creatorService.findByUsername(username);
  }
}
