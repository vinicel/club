import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CreatorModule } from './creator/creator.module';
import { MediaModule } from './media/media.module';
import { User } from './user/user.entity';
import { Creator } from './creator/creator.entity';
import { Media } from './media/media.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Creator, Media],
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true, // Exécute automatiquement les migrations au démarrage
      synchronize: false, // Désactivé pour utiliser les migrations
      logging: true,
    }),
    AuthModule,
    UserModule,
    CreatorModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
