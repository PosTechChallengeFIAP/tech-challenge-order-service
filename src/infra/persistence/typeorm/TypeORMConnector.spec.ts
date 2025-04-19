import { IDataBaseConnector } from "../IDataBaseConnector";
import { TypeOrmConnector } from "./TypeORMConnector";

describe("TypeORMConnector", () => {
    let typeORMConnector: IDataBaseConnector;

    beforeAll(() => {
        typeORMConnector = TypeOrmConnector.getInstance();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe("when the database connection is ok", () => {
        it("shouldn't throw an error", async () => {
            let thrownError = false;

            try {
                await typeORMConnector.connect();
            } catch (error) {
                thrownError = true;
            }

            expect(thrownError).toBe(false);
        });
    });

    describe("when the database connection is not ok", () => {
        it("should throw an error", async () => {
            let thrownError = false;

            const databaseIsConnected = jest.spyOn(typeORMConnector, 'isConnected').mockReturnValue(false);

            try {
                await typeORMConnector.connect();
            } catch (error) {
                thrownError = true;
                expect(error).toBeInstanceOf(Error);
                expect((error as Error).message).toBe("Database connection failed");
            }

            expect(thrownError).toBe(true);
            expect(databaseIsConnected).toHaveBeenCalled();
        });
    });
})