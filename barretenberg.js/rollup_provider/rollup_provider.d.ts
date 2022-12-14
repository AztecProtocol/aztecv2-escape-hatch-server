/// <reference types="node" />
import { BlockSource } from '../block_source';
import { TxHash } from '../tx_hash';
import { BlockchainStatus } from '../blockchain';
import { ViewingKey } from '../viewing_key';
export declare enum SettlementTime {
    SLOW = 0,
    AVERAGE = 1,
    FAST = 2,
    INSTANT = 3
}
export interface Proof {
    proofData: Buffer;
    viewingKeys: ViewingKey[];
    depositSignature?: Buffer;
    parentProof?: Proof;
}
export interface FeeQuote {
    fee: bigint;
    time: SettlementTime;
}
export interface AssetFeeQuote {
    feeConstants: bigint[];
    baseFeeQuotes: FeeQuote[];
}
export interface RuntimeConfig {
    ready: boolean;
    useKeyCache: boolean;
    numOuterRollupProofs: number;
}
export interface RollupProviderStatus {
    blockchainStatus: BlockchainStatus;
    txFees: AssetFeeQuote[];
    nextPublishTime: Date;
    pendingTxCount: number;
    runtimeConfig: RuntimeConfig;
}
export interface RollupProvider extends BlockSource {
    sendProof(proof: Proof): Promise<TxHash>;
    getStatus(): Promise<RollupProviderStatus>;
    getPendingTxs: () => Promise<TxHash[]>;
    getPendingNoteNullifiers: () => Promise<Buffer[]>;
    clientLog: (msg: any) => Promise<void>;
}
//# sourceMappingURL=rollup_provider.d.ts.map