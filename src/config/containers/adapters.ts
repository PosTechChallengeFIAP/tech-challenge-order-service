import { IInventoryServiceAdapter } from "@infra/adapters/InventoryService/IInventoryServiceAdapter";
import { InventoryServiceAdapter } from "@infra/adapters/InventoryService/InventoryServiceAdapter";
import { container } from "tsyringe";

container.registerSingleton<IInventoryServiceAdapter>('InventoryServiceAdapter', InventoryServiceAdapter);