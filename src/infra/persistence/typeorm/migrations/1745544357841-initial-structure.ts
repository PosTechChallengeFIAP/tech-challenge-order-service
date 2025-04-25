import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialStructure1745544357841 implements MigrationInterface {
    name = 'InitialStructure1745544357841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order-schema"."order_items" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "product_name" character varying NOT NULL, "product_price" integer NOT NULL, "quantity" integer NOT NULL, "total_price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "order-schema"."orders_status_enum" AS ENUM('ORDERING', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'PREPARING', 'CANCELLED', 'QUEUED', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "order-schema"."orders" ("id" SERIAL NOT NULL, "status" "order-schema"."orders_status_enum" NOT NULL, "payment_id" integer NOT NULL, "pdv_id" integer NOT NULL, "pdv_name" character varying NOT NULL, "client_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "order-schema"."orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP TABLE "order-schema"."orders"`);
        await queryRunner.query(`DROP TYPE "order-schema"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order-schema"."order_items"`);
    }

}
