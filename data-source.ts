import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import { Creator } from './src/creator/creator.entity';

export default new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, Creator],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Important: désactivé pour utiliser les migrations
  logging: true,
});
