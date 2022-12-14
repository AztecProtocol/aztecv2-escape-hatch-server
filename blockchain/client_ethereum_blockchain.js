"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEthereumBlockchain = void 0;
const providers_1 = require("@ethersproject/providers");
const address_1 = require("./../barretenberg.js/address");
const asset_1 = require("./asset");
const hash_data_1 = require("./hash_data");
const rollup_processor_1 = require("./rollup_processor");
class ClientEthereumBlockchain {
  constructor(
    rollupContractAddress,
    assetInfos,
    ethereumProvider,
    minConfirmation = 1
  ) {
    this.ethereumProvider = ethereumProvider;
    this.minConfirmation = minConfirmation;
    this.provider = new providers_1.Web3Provider(this.ethereumProvider);
    this.rollupProcessor = new rollup_processor_1.RollupProcessor(
      rollupContractAddress,
      this.provider
    );
    this.assets = assetInfos.map((info) =>
      info.address.equals(address_1.EthAddress.ZERO)
        ? new asset_1.EthAsset(this.provider)
        : new asset_1.TokenAsset(this.provider, info, minConfirmation)
    );
  }
  getAsset(assetId) {
    return this.assets[assetId];
  }
  async getUserPendingDeposit(assetId, account) {
    return this.rollupProcessor.getUserPendingDeposit(assetId, account);
  }
  async getUserProofApprovalStatus(account, signingData) {
    const proofHash = hash_data_1.hashData(signingData);
    return this.rollupProcessor.getUserProofApprovalStatus(account, proofHash);
  }
  async depositPendingFunds(assetId, amount, from, permitArgs, provider) {
    return this.rollupProcessor.depositPendingFunds(
      assetId,
      amount,
      permitArgs,
      this.getEthSigner(from, provider)
    );
  }
  async approveProof(account, signingData, provider) {
    const proofHash = hash_data_1.hashData(signingData);
    return this.rollupProcessor.approveProof(
      proofHash,
      this.getEthSigner(account, provider)
    );
  }
  /**
   * Wait for given transaction to be mined, and return receipt.
   */
  async getTransactionReceipt(
    txHash,
    interval = 1,
    timeout = 300,
    minConfirmation = this.minConfirmation
  ) {
    const started = Date.now();
    while (true) {
      if (timeout && Date.now() - started > timeout * 1000) {
        throw new Error(`Timeout awaiting tx confirmation: ${txHash}`);
      }
      const txReceipt = await this.provider.getTransactionReceipt(
        txHash.toString()
      );
      if (
        !minConfirmation ||
        (txReceipt && txReceipt.confirmations >= minConfirmation)
      ) {
        return txReceipt
          ? { status: !!txReceipt.status, blockNum: txReceipt.blockNumber }
          : { status: false, blockNum: 0 };
      }
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }
  }
  async isContract(address) {
    return (await this.provider.getCode(address.toString())) !== "0x";
  }
  getEthSigner(address, provider) {
    return (provider
      ? new providers_1.Web3Provider(provider)
      : this.provider
    ).getSigner(address.toString());
  }
}
exports.ClientEthereumBlockchain = ClientEthereumBlockchain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X2V0aGVyZXVtX2Jsb2NrY2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY2xpZW50X2V0aGVyZXVtX2Jsb2NrY2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0RBQXdEO0FBQ3hELGtEQUFrRDtBQUlsRCxtQ0FBK0M7QUFFL0MsMkNBQXVDO0FBQ3ZDLHlEQUFxRDtBQUVyRCxNQUFhLHdCQUF3QjtJQUtuQyxZQUNFLHFCQUFpQyxFQUNqQyxVQUE2QixFQUNyQixnQkFBa0MsRUFDbEMsa0JBQWtCLENBQUM7UUFEbkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxvQkFBZSxHQUFmLGVBQWUsQ0FBSTtRQUUzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0NBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFVLENBQUMsSUFBSSxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxJQUFJLGdCQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixDQUFDLENBQUMsSUFBSSxrQkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQztJQUVNLFFBQVEsQ0FBQyxPQUFnQjtRQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxPQUFnQixFQUFFLE9BQW1CO1FBQ3RFLE9BQU8sSUFBSSxDQUFD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
