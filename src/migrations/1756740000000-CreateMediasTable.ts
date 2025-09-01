import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMediasTable1756740000000 implements MigrationInterface {
  name = 'CreateMediasTable1756740000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'medias',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default:
              "lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' || hex(randomblob(6)))",
          },
          {
            name: 'mediaUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'blurredMediaUrl',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'creatorId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      CREATE INDEX idx_medias_creator_id ON medias(creatorId);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('medias');
  }
}
