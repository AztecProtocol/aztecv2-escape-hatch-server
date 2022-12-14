/// <reference types="node" />
import { Web3Provider } from '@ethersproject/providers';
import { EthAddress } from '@barretenberg/address';
import { EthereumSignature, EthereumSigner, TypedData } from '@barretenberg/blockchain';
export declare class Web3Signer implements EthereumSigner {
    private provider;
    constructor(provider: Web3Provider);
    signPersonalMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signMessage(message: Buffer, address: EthAddress): Promise<Buffer>;
    signTypedData({ domain, types, message }: TypedData, address: EthAddress): Promise<EthereumSignature>;
    validateSignature(publicOwner: EthAddress, signature: Buffer, signingData: Buffer): boolean;
}
//# sourceMappingURL=web3_signer.d.ts.map