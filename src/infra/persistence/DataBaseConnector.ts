import { DataSource as TypeOrmDataSource } from 'typeorm';
import { typeOrmConnection } from './typeorm/TypeORMConection';
import { Logger } from '@infra/utils/logger/Logger';

export class DataBaseConnector {
  private static instance: DataBaseConnector;
  private typeOrmConnection: TypeOrmDataSource;

  private constructor() {
    this.typeOrmConnection = typeOrmConnection;
  }

  public static getInstance(): DataBaseConnector {
    if (!DataBaseConnector.instance) {
      DataBaseConnector.instance = new DataBaseConnector();
    }
    return DataBaseConnector.instance;
  }

  public async connect(): Promise<boolean> {
    await this.typeOrmConnection.initialize()
        .then(() => {
            Logger.info({
                        message: '[DATABASE] - Connected'
                    })
        })
        .catch((error) => {
            Logger.error({
                message: '[DATABASE] - Connection failed',
                additionalInfo: { errorMessage: error.message }
            })
        });
    return this.typeOrmConnection.isInitialized;
  }

  public async disconnect(): Promise<boolean> {
    typeOrmConnection.destroy()
        .then(() => {   
            Logger.info({
                message: '[DATABASE] - Disconnected'
            })
        })
        .catch((error) => {
            Logger.error({
                message: '[DATABASE] - Disconnection failed',
                additionalInfo: { errorMessage: error.message }
            })
        });
    return !this.typeOrmConnection.isInitialized;
  }
}