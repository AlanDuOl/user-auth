import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDatabase1606398813198 implements MigrationInterface {
    name = 'updateDatabase1606398813198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_role"("id", "name") SELECT "id", "name" FROM "role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`ALTER TABLE "temporary_role" RENAME TO "role"`);
        await queryRunner.query(`CREATE TABLE "temporary_role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_d430b72bf1eaebce7f87068a431" UNIQUE ("name"))`);
        await queryRunner.query(`INSERT INTO "temporary_role"("id", "name") SELECT "id", "name" FROM "role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`ALTER TABLE "temporary_role" RENAME TO "role"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" RENAME TO "temporary_role"`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "role"("id", "name") SELECT "id", "name" FROM "temporary_role"`);
        await queryRunner.query(`DROP TABLE "temporary_role"`);
        await queryRunner.query(`ALTER TABLE "role" RENAME TO "temporary_role"`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "role"("id", "name") SELECT "id", "name" FROM "temporary_role"`);
        await queryRunner.query(`DROP TABLE "temporary_role"`);
    }

}
