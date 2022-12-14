import { Web3Provider } from '@ethersproject/providers';
import { EthAddress } from '@barretenberg/address';
import { PriceFeed } from '@barretenberg/blockchain';
export declare class TokenPriceFeed implements PriceFeed {
    private contract;
    constructor(priceFeedContractAddress: EthAddress, provider: Web3Provider);
    price(): Promise<bigint>;
    latestRound(): Promise<bigint>;
    getRoundData(roundId: bigint): Promise<{
        roundId: bigint;
        price: bigint;
        timestamp: number;
    }>;
    getHistoricalPrice(roundId: bigint): Promise<bigint>;
}
//# sourceMappingURL=token_price_feed.d.ts.map