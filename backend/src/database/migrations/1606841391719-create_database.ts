import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabase1606841391719 implements MigrationInterface {
    name = 'createDatabase1606841391719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "verification" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_8300048608d8721aea27747b07" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL, "isVerified" boolean NOT NULL, "createdAt" datetime NOT NULL, "updatedAt" datetime NOT NULL, "resetPasswordDate" datetime NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "validated" boolean NOT NULL, "expiresValidation" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fdf65c16d62910b4785a18cdfc" ON "userRoles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5760f2a1066eb90b4c223c16a1" ON "userRoles" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "temporary_verification" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_8300048608d8721aea27747b07" UNIQUE ("userId"), CONSTRAINT "FK_8300048608d8721aea27747b07a" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_verification"("token", "expiresAt", "userId") SELECT "token", "expiresAt", "userId" FROM "verification"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`ALTER TABLE "temporary_verification" RENAME TO "verification"`);
        await queryRunner.query(`CREATE TABLE "temporary_change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "validated" boolean NOT NULL, "expiresValidation" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"), CONSTRAINT "FK_46bfee4492162a8886653c39674" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_change_password"("token", "expiresAt", "validated", "expiresValidation", "userId") SELECT "token", "expiresAt", "validated", "expiresValidation", "userId" FROM "change_password"`);
        await queryRunner.query(`DROP TABLE "change_password"`);
        await queryRunner.query(`ALTER TABLE "temporary_change_password" RENAME TO "change_password"`);
        await queryRunner.query(`DROP INDEX "IDX_fdf65c16d62910b4785a18cdfc"`);
        await queryRunner.query(`DROP INDEX "IDX_5760f2a1066eb90b4c223c16a1"`);
        await queryRunner.query(`CREATE TABLE "temporary_userRoles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "FK_fdf65c16d62910b4785a18cdfce" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_5760f2a1066eb90b4c223c16a10" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "temporary_userRoles"("userId", "roleId") SELECT "userId", "roleId" FROM "userRoles"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`ALTER TABLE "temporary_userRoles" RENAME TO "userRoles"`);
        await queryRunner.query(`CREATE INDEX "IDX_fdf65c16d62910b4785a18cdfc" ON "userRoles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5760f2a1066eb90b4c223c16a1" ON "userRoles" ("roleId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5760f2a1066eb90b4c223c16a1"`);
        await queryRunner.query(`DROP INDEX "IDX_fdf65c16d62910b4785a18cdfc"`);
        await queryRunner.query(`ALTER TABLE "userRoles" RENAME TO "temporary_userRoles"`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`INSERT INTO "userRoles"("userId", "roleId") SELECT "userId", "roleId" FROM "temporary_userRoles"`);
        await queryRunner.query(`DROP TABLE "temporary_userRoles"`);
        await queryRunner.query(`CREATE INDEX "IDX_5760f2a1066eb90b4c223c16a1" ON "userRoles" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdf65c16d62910b4785a18cdfc" ON "userRoles" ("userId") `);
        await queryRunner.query(`ALTER TABLE "change_password" RENAME TO "temporary_change_password"`);
        await queryRunner.query(`CREATE TABLE "change_password" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "validated" boolean NOT NULL, "expiresValidation" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_46bfee4492162a8886653c3967" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "change_password"("token", "expiresAt", "validated", "expiresValidation", "userId") SELECT "token", "expiresAt", "validated", "expiresValidation", "userId" FROM "temporary_change_password"`);
        await queryRunner.query(`DROP TABLE "temporary_change_password"`);
        await queryRunner.query(`ALTER TABLE "verification" RENAME TO "temporary_verification"`);
        await queryRunner.query(`CREATE TABLE "verification" ("token" varchar PRIMARY KEY NOT NULL, "expiresAt" datetime NOT NULL, "userId" integer, CONSTRAINT "REL_8300048608d8721aea27747b07" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "verification"("token", "expiresAt", "userId") SELECT "token", "expiresAt", "userId" FROM "temporary_verification"`);
        await queryRunner.query(`DROP TABLE "temporary_verification"`);
        await queryRunner.query(`DROP INDEX "IDX_5760f2a1066eb90b4c223c16a1"`);
        await queryRunner.query(`DROP INDEX "IDX_fdf65c16d62910b4785a18cdfc"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`DROP TABLE "change_password"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
