import {MigrationInterface, QueryRunner} from "typeorm";

export class seedDb1605118476518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // seed roles
        await queryRunner.query(`INSERT INTO "roles" ("name") VALUES ('Admin')`);
        await queryRunner.query(`INSERT INTO "roles" ("name") VALUES ('User')`);
        // seed admin user
        // password is A1234/56
        await queryRunner.query(`INSERT INTO "users" ("name", "email", "passwordHash")
        VALUES ("boris", "boris@gmail.com", "$2a$10$n8jNPKlA/./YuN7LUHsJoeQcIuySym5AKY9.J5YyRlSOkBYg93n12")`);
        await queryRunner.query(`INSERT INTO "userRoles" ("usersId", "rolesId")
        VALUES (1, 1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
