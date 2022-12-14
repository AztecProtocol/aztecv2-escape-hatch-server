#!/usr/bin/env node
import { Contract, Signer } from 'ethers';
export declare function addAsset(rollup: Contract, signer: Signer, supportsPermit: boolean): Promise<Contract>;
export declare function setSupportedAsset(rollup: Contract, address: string, supportsPermit: boolean): Promise<void>;
//# sourceMappingURL=add_asset.d.ts.map