/// <reference types="node" />
import { EthAddress } from '@barretenberg/address';
import { AssetId } from '@barretenberg/asset';
import { Asset, BlockchainAsset, PermitArgs } from '@barretenberg/blockchain';
import { TxHash } from '@barretenberg/tx_hash';
import { EthereumProvider } from './ethereum_provider';
export declare class ClientEthereumBlockchain {
    private ethereumProvider;
    private minConfirmation;
    private provider;
    private rollupProcessor;
    private assets;
    constructor(rollupContractAddress: EthAddress, assetInfos: BlockchainAsset[], ethereumProvider: EthereumProvider, minConfirmation?: number);
    getAsset(assetId: AssetId): Asset;
    getUserPendingDeposit(assetId: AssetId, account: EthAddress): Promise<bigint>;
    getUserProofApprovalStatus(account: EthAddress, signingData: Buffer): Promise<boolean>;
    depositPendingFunds(assetId: AssetId, amount: bigint, from: EthAddress, permitArgs?: PermitArgs, provider?: EthereumProvider): Promise<TxHash>;
    approveProof(account: EthAddress, signingData: Buffer, provider?: EthereumProvider): Promise<TxHash>;
    /**
     * Wait for given transaction to be mined, and return receipt.
     */
    getTransactionReceipt(txHash: TxHash, interval?: number, timeout?: number, minConfirmation?: number): Promise<{
        status: boolean;
        blockNum: number;
    }>;
    isContract(address: EthAddress): Promise<boolean>;
    private getEthSigner;
}
//# sourceMappingURL=client_ethereum_blockchain.d.ts.map