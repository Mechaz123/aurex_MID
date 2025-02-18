import { Exchange } from "./exchange.interface";
import { ExchangeStatus } from "./exchange_status.interface";

export interface ExchangeHistory {
    id: number;
    exchange: Exchange;
    previous_status: ExchangeStatus;
    new_status: ExchangeStatus;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}