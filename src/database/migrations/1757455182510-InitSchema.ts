import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1757455182510 implements MigrationInterface {
    name = 'InitSchema1757455182510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_c8708288b8e6a060ed7b9e1a226\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_416d7b6f94de26244a7be38d87a\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_dfb298e37d26ca75c3b1b1c8010\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`company_name\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`company_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_4253ee2b695fdcf143cfc5a7cc\` ON \`clients\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`contact_email\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`contact_email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD UNIQUE INDEX \`IDX_4253ee2b695fdcf143cfc5a7cc\` (\`contact_email\`)`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`budget\` \`budget\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_c8708288b8e6a060ed7b9e1a226\` FOREIGN KEY (\`company_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_416d7b6f94de26244a7be38d87a\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_dfb298e37d26ca75c3b1b1c8010\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_dfb298e37d26ca75c3b1b1c8010\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_416d7b6f94de26244a7be38d87a\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_c8708288b8e6a060ed7b9e1a226\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`budget\` \`budget\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP INDEX \`IDX_4253ee2b695fdcf143cfc5a7cc\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`contact_email\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`contact_email\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4253ee2b695fdcf143cfc5a7cc\` ON \`clients\` (\`contact_email\`)`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`company_name\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`company_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_dfb298e37d26ca75c3b1b1c8010\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`expandersapp\`.\`vendors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_416d7b6f94de26244a7be38d87a\` FOREIGN KEY (\`project_id\`) REFERENCES \`expandersapp\`.\`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_c8708288b8e6a060ed7b9e1a226\` FOREIGN KEY (\`company_id\`) REFERENCES \`expandersapp\`.\`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
