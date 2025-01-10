import { Auction } from "./auction.interface";
import { User } from "./user.interface";

export interface Bid {
    id: number;
    auction: Auction;
    user: User;
    amount: number;
    bid_date: Date;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}