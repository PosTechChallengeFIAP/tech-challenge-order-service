import { DataBaseConnector } from "@infra/persistence/DataBaseConnector";
import { ReadinessUseCase } from "./ReadinessUseCase";
import { InternalServerError } from "@infra/http/errors/http-errors/InternalServerError";

describe("ReadinessUseCase", () => {
    let readinessUseCase: ReadinessUseCase;

    beforeAll(() => {
        const mockConnect = jest.fn().mockResolvedValue(true);
        const mockIsConnected = jest.fn().mockReturnValue(true);
        const mockDisconnect = jest.fn().mockResolvedValue(true);

        const mockInstance = {
            connect: mockConnect,
            isConnected: mockIsConnected,
            disconnect: mockDisconnect
        } as unknown as DataBaseConnector;

        jest.spyOn(DataBaseConnector, 'getInstance').mockReturnValue(mockInstance);

        readinessUseCase = new ReadinessUseCase();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe("when the database connection is ok", () => {
        it("shouldn't throw an error", async () => {
            let thrownError = false;

            try {
                await readinessUseCase.execute();
            } catch (error) {
                thrownError = true;
            }

            expect(thrownError).toBe(false);
        });
    });

    describe("when the database connection is not ok", () => {
        it("should throw an error", async () => {
            const mockIsConnected = jest.fn().mockReturnValue(false);
            const mockInstance = {
                isConnected: mockIsConnected,
            } as unknown as DataBaseConnector;
            jest.spyOn(DataBaseConnector, 'getInstance').mockReturnValue(mockInstance);

            let thrownError = false;

            try {
                await readinessUseCase.execute();
            } catch (error) {
                thrownError = true;
                expect(error).toBeInstanceOf(InternalServerError);
                expect((error as InternalServerError).message).toBe("Database is not connected");
            }

            expect(thrownError).toBe(true);
        });
    });
});