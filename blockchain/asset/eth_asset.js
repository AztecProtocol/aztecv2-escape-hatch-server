"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthAsset = void 0;
const address_1 = require("./../../barretenberg.js/address");
const units_1 = require("../units");
/* eslint-disable @typescript-eslint/no-unused-vars */
class EthAsset {
  constructor(provider) {
    this.provider = provider;
    this.precision = 6;
  }
  getStaticInfo() {
    return {
      address: address_1.EthAddress.ZERO,
      name: "Eth",
      symbol: "ETH",
      decimals: 18,
      permitSupport: false,
      gasConstants: [5000, 0, 5000, 30000],
    };
  }
  async getUserNonce(account) {
    return BigInt(0);
  }
  async balanceOf(account) {
    return BigInt(await this.provider.getBalance(account.toString()));
  }
  async allowance(owner, receiver) {
    throw new Error("Allowance unsupported for ETH.");
  }
  async approve(value, owner, receiver) {
    throw new Error("Approve unsupported for ETH.");
  }
  async mint(value, account) {
    throw new Error("Mint unsupported for ETH.");
  }
  fromBaseUnits(value, precision = this.precision) {
    return units_1.fromBaseUnits(value, 18, precision);
  }
  toBaseUnits(value) {
    return units_1.toBaseUnits(value, 18);
  }
}
exports.EthAsset = EthAsset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoX2Fzc2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fzc2V0L2V0aF9hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxrREFBa0Q7QUFHbEQsb0NBQXNEO0FBRXRELHNEQUFzRDtBQUV0RCxNQUFhLFFBQVE7SUFHbkIsWUFBb0IsUUFBc0I7UUFBdEIsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQUZsQyxjQUFTLEdBQUcsQ0FBQyxDQUFDO0lBRXVCLENBQUM7SUFFOUMsYUFBYTtRQUNYLE9BQU87WUFDTCxPQUFPLEVBQUUsb0JBQVUsQ0FBQyxJQUFJO1lBQ3hCLElBQUksRUFBRSxLQUFLO1lBQ1gsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFlBQVksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztTQUNyQyxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBbUI7UUFDcEMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBbUI7UUFDakMsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQWlCLEVBQUUsUUFBb0I7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWEsRUFBRSxLQUFpQixFQUFFLFFBQW9CO1FBQ2xFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFhLEVBQUUsT0FBbUI7UUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxhQUFhLENBQUMsS0FBYSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUztRQUM1RCxPQUFPLHFCQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQWE7UUFDOUIsT0FBTyxtQkFBVyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0Y7QUEzQ0QsNEJBMkNDIn0=
