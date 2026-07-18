import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1784398990009 implements MigrationInterface {
    name = 'Migrations1784398990009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "selected" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "selected"`);
    }

}
