import {MigrationInterface, QueryRunner} from "typeorm";

export class seedDatabase1606227664947 implements MigrationInterface {
    name = 'seedDatabase1606227664947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // seed roles
        await queryRunner.query(`INSERT INTO "role" ("name") VALUES ('Admin')`);
        await queryRunner.query(`INSERT INTO "role" ("name") VALUES ('User')`);
        // seed admin user
        // password is A1234/56
        await queryRunner.query(`INSERT INTO "user" ("name", "email", "passwordHash", "isVerified")
        VALUES ("boris", "boris@gmail.com", "$2a$10$n8jNPKlA/./YuN7LUHsJoeQcIuySym5AKY9.J5YyRlSOkBYg93n12", "true")`);
        await queryRunner.query(`INSERT INTO "userRoles" ("userId", "roleId")
        VALUES (1, 1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}