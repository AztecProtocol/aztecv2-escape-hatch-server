"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAsset = void 0;
const providers_1 = require("@ethersproject/providers");
const tx_hash_1 = require("./../../barretenberg.js/tx_hash");
const ethers_1 = require("ethers");
const units_1 = require("../units");
const abi = [
  "function decimals() public view returns (uint8)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function mint(address _to, uint256 _value) public returns (bool)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function nonces(address) public view returns(uint256)",
];
class TokenAsset {
  constructor(ethersProvider, info, minConfirmations = 1) {
    this.ethersProvider = ethersProvider;
    this.info = info;
    this.minConfirmations = minConfirmations;
    this.precision = 2;
    this.contract = new ethers_1.Contract(
      info.address.toString(),
      abi,
      ethersProvider
    );
  }
  static async fromAddress(
    address,
    ethersProvider,
    permitSupport,
    minConfirmations = 1
  ) {
    const contract = new ethers_1.Contract(
      address.toString(),
      abi,
      ethersProvider
    );
    const info = {
      address,
      name: await contract.name(),
      symbol: await contract.symbol(),
      decimals: +(await contract.decimals()),
      permitSupport,
      gasConstants: [5000, 0, 36000, 36000],
    };
    return new TokenAsset(ethersProvider, info, minConfirmations);
  }
  getStaticInfo() {
    return this.info;
  }
  async getUserNonce(account) {
    return BigInt(await this.contract.nonces(account.toString()));
  }
  async balanceOf(account) {
    const balance = await this.contract.balanceOf(account.toString());
    return BigInt(balance);
  }
  async allowance(owner, receiver) {
    const allowance = await this.contract.allowance(
      owner.toString(),
      receiver.toString()
    );
    return BigInt(allowance);
  }
  async approve(value, owner, receiver, provider) {
    const contract = this.getContractWithSigner(owner, provider);
    const res = await contract.approve(receiver.toString(), value);
    const receipt = await res.wait(this.minConfirmations);
    return tx_hash_1.TxHash.fromString(receipt.transactionHash);
  }
  async mint(value, account, provider) {
    const contract = this.getContractWithSigner(account, provider);
    const res = await contract.mint(account.toString(), value);
    const receipt = await res.wait(this.minConfirmations);
    return tx_hash_1.TxHash.fromString(receipt.transactionHash);
  }
  fromBaseUnits(value, precision = this.precision) {
    return units_1.fromBaseUnits(value, this.info.decimals, precision);
  }
  toBaseUnits(value) {
    return units_1.toBaseUnits(value, this.info.decimals);
  }
  getContractWithSigner(account, provider) {
    const ethSigner = (provider
      ? new providers_1.Web3Provider(provider)
      : this.ethersProvider
    ).getSigner(account.toString());
    return new ethers_1.Contract(this.info.address.toString(), abi, ethSigner);
  }
}
exports.TokenAsset = TokenAsset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5fYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXNzZXQvdG9rZW5fYXNzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0RBQXdEO0FBR3hELGtEQUE4QztBQUM5QyxtQ0FBa0M7QUFFbEMsb0NBQXNEO0FBRXRELE1BQU0sR0FBRyxHQUFHO0lBQ1YsaURBQWlEO0lBQ2pELHlFQUF5RTtJQUN6RSxrRkFBa0Y7SUFDbEYsbUVBQW1FO0lBQ25FLGtFQUFrRTtJQUNsRSw4Q0FBOEM7SUFDOUMsZ0RBQWdEO0lBQ2hELHVEQUF1RDtDQUN4RCxDQUFDO0FBRUYsTUFBYSxVQUFVO0lBSXJCLFlBQW9CLGNBQTRCLEVBQVUsSUFBcUIsRUFBVSxtQkFBbUIsQ0FBQztRQUF6RixtQkFBYyxHQUFkLGNBQWMsQ0FBYztRQUFVLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFJO1FBRnJHLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFHcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUN0QixPQUFtQixFQUNuQixjQUE0QixFQUM1QixhQUFzQixFQUN0QixnQkFBZ0IsR0FBRyxDQUFDO1FBRXBCLE1BQU0sUUFBUSxHQUFHLElBQUksaUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sSUFBSSxHQUFHO1lBQ1gsT0FBTztZQUNQLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDM0IsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUMvQixRQUFRLEVBQUUsQ0FB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
