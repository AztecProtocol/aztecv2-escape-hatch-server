import { Signer } from 'ethers';
export declare function deploy(escapeHatchBlockLower: number, escapeHatchBlockUpper: number, uniswapRouterAddress: string, multiSigAddr: string, signer: Signer): Promise<{
    rollup: import("ethers").Contract;
    feeDistributor: import("ethers").Contract;
}>;
//# sourceMappingURL=deploy.d.ts.map