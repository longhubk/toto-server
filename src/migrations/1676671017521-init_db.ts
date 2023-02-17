import { MigrationInterface, QueryRunner } from "typeorm";

export class initDb1676671017521 implements MigrationInterface {
  name = 'initDb1676671017521'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "todos" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "todos"`);
  }

}
