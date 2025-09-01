import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './creator.entity';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  controllers: [CreatorController],
  providers: [CreatorService],
  exports: [CreatorService],
})
export class CreatorModule {}
