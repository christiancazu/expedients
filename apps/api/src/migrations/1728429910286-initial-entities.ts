import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialEntities1728429910286 implements MigrationInterface {
  name = 'InitialEntities1728429910286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "role" "public"."users_role_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."parts_type_enum" AS ENUM('DENUNCIANTE', 'DENUNCIADO')`
    );
    await queryRunner.query(
      `CREATE TABLE "parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."parts_type_enum" NOT NULL, "expedientId" uuid, CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "url" character varying(100) NOT NULL, "type" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "createdById" uuid, "updatedById" uuid, CONSTRAINT "REL_129be5647f7217471286e249c3" UNIQUE ("createdById"), CONSTRAINT "REL_682adcc34fbd7d16186705a8ce" UNIQUE ("updatedById"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expedients_status_enum" AS ENUM('TACHADO', 'EJECUCION')`
    );
    await queryRunner.query(
      `CREATE TABLE "expedients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, "subject" character varying(50) NOT NULL, "court" character varying(50) NOT NULL, "status" "public"."expedients_status_enum" NOT NULL DEFAULT 'EJECUCION', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, "updatedById" uuid, CONSTRAINT "UQ_ee9a643d474783165de8b3f0aed" UNIQUE ("code"), CONSTRAINT "UQ_c207c5b918ab0d7f162c2e20f9d" UNIQUE ("subject"), CONSTRAINT "UQ_b339c56cc1de0ccd6f8955ec78d" UNIQUE ("court"), CONSTRAINT "REL_fe7270d86781fb5569e3d69720" UNIQUE ("createdById"), CONSTRAINT "REL_cf3e5c578ecfacdb3e43f33b62" UNIQUE ("updatedById"), CONSTRAINT "PK_7abe96162f1ba6457c851d70f65" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "updatedById" uuid, CONSTRAINT "REL_9bea010321f1003170c325233e" UNIQUE ("updatedById"), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "parts" ADD CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_129be5647f7217471286e249c34" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_682adcc34fbd7d16186705a8ce2" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" ADD CONSTRAINT "FK_fe7270d86781fb5569e3d69720a" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" ADD CONSTRAINT "FK_cf3e5c578ecfacdb3e43f33b626" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_07db4484ee71a2c0e2e90757865" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_9bea010321f1003170c325233e8" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_9bea010321f1003170c325233e8"`
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_07db4484ee71a2c0e2e90757865"`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" DROP CONSTRAINT "FK_cf3e5c578ecfacdb3e43f33b626"`
    );
    await queryRunner.query(
      `ALTER TABLE "expedients" DROP CONSTRAINT "FK_fe7270d86781fb5569e3d69720a"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_682adcc34fbd7d16186705a8ce2"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_129be5647f7217471286e249c34"`
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a"`
    );
    await queryRunner.query(
      `ALTER TABLE "parts" DROP CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0"`
    );
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "expedients"`);
    await queryRunner.query(`DROP TYPE "public"."expedients_status_enum"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "parts"`);
    await queryRunner.query(`DROP TYPE "public"."parts_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
