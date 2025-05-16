import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePriceToDecimal1747367508114 implements MigrationInterface {
    name = 'ChangePriceToDecimal1747367508114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" DROP COLUMN "product_price"`);
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" ADD "product_price" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" DROP COLUMN "product_price"`);
        await queryRunner.query(`ALTER TABLE "order-schema"."order_items" ADD "product_price" integer NOT NULL`);
    }

}
