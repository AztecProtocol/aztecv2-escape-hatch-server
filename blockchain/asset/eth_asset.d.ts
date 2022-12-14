import { Web3Provider } from '@ethersproject/providers';
import { EthAddress } from '@barretenberg/address';
import { Asset } from '@barretenberg/blockchain';
import { TxHash } from '@barretenberg/tx_hash';
export declare class EthAsset implements Asset {
    private provider;
    private precision;
    constructor(provider: Web3Provider);
    getStaticInfo(): {
        address: EthAddress;
        name: string;
        symbol: string;
        decimals: number;
        permitSupport: boolean;
        gasConstants: number[];
    };
    getUserNonce(account: EthAddress): Promise<bigint>;
    balanceOf(account: EthAddress): Promise<bigint>;
    allowance(owner: EthAddress, receiver: EthAddress): Promise<bigint>;
    approve(value: bigint, owner: EthAddress, receiver: EthAddress): Promise<TxHash>;
    mint(value: bigint, account: EthAddress): Promise<TxHash>;
    fromBaseUnits(value: bigint, precision?: number): string;
    toBaseUnits(value: string): bigint;
}
//# sourceMappingURL=eth_asset.d.ts.map