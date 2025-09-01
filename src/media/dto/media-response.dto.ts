export class MediaResponseDto {
  mediaId: string;
  mediaUrl?: string;
  blurredMediaUrl: string;

  constructor(media: any, showFullMedia: boolean = false) {
    this.mediaId = media.id;
    this.blurredMediaUrl = media.blurredMediaUrl;
  }
}
