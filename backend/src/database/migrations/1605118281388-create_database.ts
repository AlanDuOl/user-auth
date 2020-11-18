import {MigrationInterface, QueryRunner} from "typeorm";

export class createDatabase1605118281388 implements MigrationInterface {
    name = 'createDatabase1605118281388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "passwordHash" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58c23e01fb611af5651e28a03b" ON "userRoles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_05fa970e3b2fbd132db31a9467" ON "userRoles" ("rolesId") `);
        await queryRunner.query(`DROP INDEX "IDX_58c23e01fb611af5651e28a03b"`);
        await queryRunner.query(`DROP INDEX "IDX_05fa970e3b2fbd132db31a9467"`);
        await queryRunner.query(`CREATE TABLE "temporary_userRoles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "FK_58c23e01fb611af5651e28a03be" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_05fa970e3b2fbd132db31a94672" FOREIGN KEY ("rolesId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "temporary_userRoles"("usersId", "rolesId") SELECT "usersId", "rolesId" FROM "userRoles"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`ALTER TABLE "temporary_userRoles" RENAME TO "userRoles"`);
        await queryRunner.query(`CREATE INDEX "IDX_58c23e01fb611af5651e28a03b" ON "userRoles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_05fa970e3b2fbd132db31a9467" ON "userRoles" ("rolesId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_05fa970e3b2fbd132db31a9467"`);
        await queryRunner.query(`DROP INDEX "IDX_58c23e01fb611af5651e28a03b"`);
        await queryRunner.query(`ALTER TABLE "userRoles" RENAME TO "temporary_userRoles"`);
        await queryRunner.query(`CREATE TABLE "userRoles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "userRoles"("usersId", "rolesId") SELECT "usersId", "rolesId" FROM "temporary_userRoles"`);
        await queryRunner.query(`DROP TABLE "temporary_userRoles"`);
        await queryRunner.query(`CREATE INDEX "IDX_05fa970e3b2fbd132db31a9467" ON "userRoles" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58c23e01fb611af5651e28a03b" ON "userRoles" ("usersId") `);
        await queryRunner.query(`DROP INDEX "IDX_05fa970e3b2fbd132db31a9467"`);
        await queryRunner.query(`DROP INDEX "IDX_58c23e01fb611af5651e28a03b"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
