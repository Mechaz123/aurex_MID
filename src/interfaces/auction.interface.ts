import { AuctionStatus } from "./auction_status.interface";
import { Product } from "./product.interface";

export interface Auction {
    id: number;
    product: Product;
    initial_price: number;
    current_price: number;
    start_date: Date;
    end_date: Date;
    auction_status: AuctionStatus;
    created_at: Date;
    updated_at: Date;
}