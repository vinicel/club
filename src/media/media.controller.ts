import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatorService } from '../creator/creator.service';

@Controller('creators')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly creatorService: CreatorService,
  ) {}

  @Post(':creatorId/medias')
  @UseGuards(JwtAuthGuard)
  async createMedia(
    @Param('creatorId') creatorId: string,
    @Body(ValidationPipe) createMediaDto: CreateMediaDto,
  ): Promise<MediaResponseDto> {
    const creator = await this.creatorService.findById(creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return this.mediaService.createMedia(creatorId, createMediaDto);
  }

  @Get(':creatorId/medias')
  async getCreatorMedias(
    @Param('creatorId') creatorId: string,
    @Request() req: any,
  ): Promise<MediaResponseDto[]> {
    const creator = await this.creatorService.findById(creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const user = req.user;
    let canViewFullMedia = false;

    if (user) {
      canViewFullMedia = true;
    }

    return this.mediaService.getCreatorMedias(creatorId, canViewFullMedia);
  }
}
