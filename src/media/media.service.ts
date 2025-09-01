import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async createMedia(
    creatorId: string,
    createMediaDto: CreateMediaDto,
  ): Promise<MediaResponseDto> {
    const media = this.mediaRepository.create({
      ...createMediaDto,
      creatorId,
    });

    const savedMedia = await this.mediaRepository.save(media);
    return new MediaResponseDto(savedMedia, true);
  }

  async getCreatorMedias(
    creatorId: string,
    canViewFullMedia: boolean,
  ): Promise<MediaResponseDto[]> {
    const medias = await this.mediaRepository.find({
      where: { creatorId },
      order: { createdAt: 'DESC' },
    });

    return medias.map((media) => new MediaResponseDto(media, canViewFullMedia));
  }
}
