import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialEntities1729552815089 implements MigrationInterface {
  name = 'InitialEntities1729552815089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."type" AS ENUM('DENUNCIANTE', 'DENUNCIADO')`
    );
    await queryRunner.query(
      `CREATE TABLE "parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "type" "public"."type", "expedientId" uuid, CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "createdByUserId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "key" character varying(200) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "createdByUserId" uuid, "updatedByUserId" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."status" AS ENUM('TACHADO', 'SANEADO', 'APELADO', 'EN_EJECUCION', 'EN_PROCESO', 'EN_TRAMITE', 'FINALIZADO', 'RECHAZADO', 'SENTENCIADO', 'RESUELTO')`
    );
    await queryRunner.query(
      `CREATE TABLE "expedients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(100) NOT NULL, "subject" character varying(100) NOT NULL, "court" character varying(100) NOT NULL, "status" "public"."status" NOT NULL DEFAULT 'EN_EJECUCION', "statusDescription" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdByUserId" uuid, "updatedByUserId" uuid, CONSTRAINT "UQ_ee9a643d474783165de8b3f0aed" UNIQUE ("code"), CONSTRAINT "PK_7abe96162f1ba6457c851d70f65" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "password" character varying(200) NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "role" "public"."role" NOT NULL DEFAULT 'PRACTICANTE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "parts" ADD CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_07db4484ee71a2c0e2e90757865" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_7732db81cd05e99f89627c1369e" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_b7ad0f73094b5d9ecdebe5bf023" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_88c7d8d1c5b4e88748f14acdab5" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" ADD CONSTRAINT "FK_f473e6e1987f82b037355bb21e4" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" ADD CONSTRAINT "FK_0b89a8479dce6e47392e355ea35" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expedients" DROP CONSTRAINT "FK_0b89a8479dce6e47392e355ea35"`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" DROP CONSTRAINT "FK_f473e6e1987f82b037355bb21e4"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_88c7d8d1c5b4e88748f14acdab5"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_b7ad0f73094b5d9ecdebe5bf023"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a"`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_7732db81cd05e99f89627c1369e"`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_07db4484ee71a2c0e2e90757865"`
    );
    await queryRunner.query(
      `ALTER TABLE "parts" DROP CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0"`
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "expedients"`);
    await queryRunner.query(`DROP TYPE "public"."status"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "parts"`);
    await queryRunner.query(`DROP TYPE "public"."type"`);
  }
}
