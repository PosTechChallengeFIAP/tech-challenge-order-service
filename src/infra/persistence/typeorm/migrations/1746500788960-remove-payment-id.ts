import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePaymentId1746500788960 implements MigrationInterface {
    name = 'RemovePaymentId1746500788960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-schema"."orders" DROP COLUMN "payment_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order-schema"."orders" ADD "payment_id" integer NOT NULL`);
    }

}
