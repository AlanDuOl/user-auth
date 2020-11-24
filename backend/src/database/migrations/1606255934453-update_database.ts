import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDatabase1606255934453 implements MigrationInterface {
    name = 'updateDatabase1606255934453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_verification" ("token" varchar PRIMARY KEY NOT NULL, "userId" integer, "expiresAt" datetime NOT NULL, CONSTRAINT "UQ_8300048608d8721aea27747b07a" UNIQUE ("userId"), CONSTRAINT "FK_8300048608d8721aea27747b07a" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_verification"("token", "userId") SELECT "token", "userId" FROM "verification"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`ALTER TABLE "temporary_verification" RENAME TO "verification"`);
        await queryRunner.query(`CREATE TABLE "temporary_change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"), CONSTRAINT "FK_46bfee4492162a8886653c39674" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_change_password"("token", "expiresAt", "userId") SELECT "token", "expiresAt", "userId" FROM "change_password"`);
        await queryRunner.query(`DROP TABLE "change_password"`);
        await queryRunner.query(`ALTER TABLE "temporary_change_password" RENAME TO "change_password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "change_password" RENAME TO "temporary_change_password"`);
        await queryRunner.query(`CREATE TABLE "change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "change_password"("token", "expiresAt", "userId") SELECT "token", "expiresAt", "userId" FROM "temporary_change_password"`);
        await queryRunner.query(`DROP TABLE "temporary_change_password"`);
        await queryRunner.query(`ALTER TABLE "verification" RENAME TO "temporary_verification"`);
        await queryRunner.query(`CREATE TABLE "verification" ("token" varchar PRIMARY KEY NOT NULL, "userId" integer, CONSTRAINT "UQ_8300048608d8721aea27747b07a" UNIQUE ("userId"), CONSTRAINT "FK_8300048608d8721aea27747b07a" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "verification"("token", "userId") SELECT "token", "userId" FROM "temporary_verification"`);
        await queryRunner.query(`DROP TABLE "temporary_verification"`);
        await queryRunner.query(`DROP TABLE "change_password"`);
    }

}
