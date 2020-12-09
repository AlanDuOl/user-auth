import {MigrationInterface, QueryRunner} from "typeorm";

export class seedDatabase1607549714215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // seed roles
        await queryRunner.query(`INSERT INTO "role" ("name") VALUES ('Admin')`);
        await queryRunner.query(`INSERT INTO "role" ("name") VALUES ('User')`);
        // seed admin user
        // password is Ab1234/5
        await queryRunner.query(`INSERT INTO "user"
        ("name", "email", "passwordHash", "isVerified", "createdAt", "resetPasswordDate")
        VALUES ("boris", "boris@gmail.com",
        "$2a$10$pI04dOiYRDMt8DXoSXyDXOqNHQ17UOqQsK0cz3.7mqCdqe458q6fi", "1",
        "2020-11-30T16:03:50.454Z",
        "2020-11-30T16:03:50.454Z"
        )`);
        await queryRunner.query(`INSERT INTO "userRoles" ("userId", "roleId")
        VALUES (1, 1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
