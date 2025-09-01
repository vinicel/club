import { IsString, IsUrl } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsUrl()
  mediaUrl: string;

  @IsString()
  @IsUrl()
  blurredMediaUrl: string;
}
