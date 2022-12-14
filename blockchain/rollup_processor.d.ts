/// <reference types="node" />
import { Web3Provider } from '@ethersproject/providers';
import { EthAddress } from '@barretenberg/address';
import { AssetId } from '@barretenberg/asset';
import { PermitArgs } from '@barretenberg/blockchain';
import { Block } from '@barretenberg/block_source';
import { TxHash } from '@barretenberg/tx_hash';
import { Signer } from 'ethers';
export declare class RollupProcessor {
    private rollupContractAddress;
    private provider;
    private rollupProcessor;
    private lastQueriedRollupId?;
    private lastQueriedRollupBlockNum?;
    constructor(rollupContractAddress: EthAddress, provider: Web3Provider);
    get address(): EthAddress;
    feeDistributor(): Promise<EthAddress>;
    verifier(): Promise<EthAddress>;
    nextRollupId(): Promise<number>;
    dataSize(): Promise<number>;
    dataRoot(): Promise<Buffer>;
    nullRoot(): Promise<Buffer>;
    rootRoot(): Promise<Buffer>;
    totalDeposited(): Promise<bigint[]>;
    totalWithdrawn(): Promise<bigint[]>;
    totalFees(): Promise<bigint[]>;
    totalPendingDeposit(): Promise<bigint[]>;
    getSupportedAssets(): Promise<EthAddress[]>;
    setSupportedAsset(assetAddress: EthAddress, supportsPermit: boolean, signer?: EthAddress | Signer): Promise<TxHash>;
    getAssetPermitSupport(assetId: AssetId): Promise<boolean>;
    getEscapeHatchStatus(): Promise<{
        escapeOpen: boolean;
        blocksRemaining: number;
    }>;
    createEscapeHatchProofTx(proofData: Buffer, viewingKeys: Buffer[], signatures: Buffer[], signer?: EthAddress | Signer): Promise<Buffer>;
    createRollupProofTx(proofData: Buffer, signatures: Buffer[], viewingKeys: Buffer[], providerSignature: Buffer, providerAddress: EthAddress, feeReceiver: EthAddress, feeLimit: bigint): Promise<Buffer>;
    depositPendingFunds(assetId: AssetId, amount: bigint, permitArgs?: PermitArgs, signer?: EthAddress | Signer): Promise<TxHash>;
    approveProof(proofHash: string, signer?: EthAddress | Signer): Promise<TxHash>;
    getUserPendingDeposit(assetId: AssetId, account: EthAddress): Promise<bigint>;
    getUserProofApprovalStatus(address: EthAddress, proofHash: string): Promise<boolean>;
    private getEarliestBlock;
    /**
     * Returns all rollup blocks from (and including) the given rollupId, with >= minConfirmations.
     *
     * A normal geth node has terrible performance when searching event logs. To ensure we are not dependent
     * on third party services such as Infura, we apply an algorithm to mitigate the poor performance.
     * The algorithm will search for rollup events from the end of the chain, in chunks of blocks.
     * If it finds a rollup <= to the given rollupId, we can stop searching.
     *
     * The worst case situation is when requesting all rollups from rollup 0, or when there are no events to find.
     * In this case, we will have ever degrading performance as we search from the end of the chain to the
     * block returned by getEarliestBlock() (hardcoded on mainnet). This is a rare case however.
     *
     * The more normal case is we're given a rollupId that is not 0. In this case we know an event must exist.
     * Further, the usage pattern is that anyone making the request will be doing so with an ever increasing rollupId.
     * This lends itself well to searching backwards from the end of the chain.
     *
     * The chunk size affects performance. If no previous query has been made, or the rollupId < the previous requested
     * rollupId, the chunk size is to 100,000. This is the case when the class is queried the first time.
     * 100,000 blocks is ~10 days of blocks, so assuming there's been a rollup in the last 10 days, or the client is not
     * over 10 days behind, a single query will suffice. Benchmarks suggest this will take ~2 seconds per chunk.
     *
     * If a previous query has been made and the rollupId >= previous query, the first chunk will be from the last result
     * rollups block to the end of the chain. This provides best performance for polling clients.
     */
    getRollupBlocksFrom(rollupId: number, minConfirmations: number): Promise<Block[]>;
    private getRollupBlocksFromEvents;
    private decodeBlock;
    private getContractWithSigner;
}
//# sourceMappingURL=rollup_processor.d.ts.map