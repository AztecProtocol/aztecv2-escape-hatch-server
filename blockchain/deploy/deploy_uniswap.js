#!/usr/bin/env node
"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployUniswap = exports.createPair = void 0;
const UniswapV2Factory_json_1 = __importDefault(
  require("@uniswap/v2-core/build/UniswapV2Factory.json")
);
const UniswapV2Pair_json_1 = __importDefault(
  require("@uniswap/v2-core/build/UniswapV2Pair.json")
);
const IWETH_json_1 = __importDefault(
  require("@uniswap/v2-periphery/build/IWETH.json")
);
const UniswapV2Router02_json_1 = __importDefault(
  require("@uniswap/v2-periphery/build/UniswapV2Router02.json")
);
const address_1 = require("@barretenberg/address");
const ethers_1 = require("ethers");
const WETH9_json_1 = __importDefault(require("../contracts/WETH9.json"));
exports.createPair = async (
  owner,
  router,
  asset,
  initialTokenSupply = 10n * 10n ** 18n,
  initialEthSupply = 10n ** 16n
) => {
  const factory = new ethers_1.Contract(
    await router.factory(),
    UniswapV2Factory_json_1.default.abi,
    owner
  );
  const weth = new ethers_1.Contract(
    await router.WETH(),
    IWETH_json_1.default.abi,
    owner
  );
  if (
    !address_1.EthAddress.fromString(
      await factory.getPair(asset.address, weth.address)
    ).equals(address_1.EthAddress.ZERO)
  ) {
    console.error(
      `UniswapPair [${await asset.name()} - WETH] already created.`
    );
    return;
  }
  const minConfirmations =
    [1337, 31337].indexOf(await owner.getChainId()) >= 0 ? 1 : 3;
  const withConfirmation = async (action) => {
    const tx2 = await action;
    await tx2.wait(minConfirmations);
  };
  console.error(`Create UniswapPair [${await asset.name()} - WETH]...`);
  await withConfirmation(factory.createPair(asset.address, weth.address));
  const pairAddress = await factory.getPair(asset.address, weth.address);
  const pair = new ethers_1.Contract(
    pairAddress,
    UniswapV2Pair_json_1.default.abi,
    owner
  );
  console.error(`Pair contract address: ${pairAddress}`);
  await withConfirmation(asset.mint(pair.address, initialTokenSupply));
  await withConfirmation(weth.deposit({ value: initialEthSupply }));
  await withConfirmation(weth.transfer(pair.address, initialEthSupply));
  // Don't do this in production.
  await pair.mint(await owner.getAddress());
  console.error(`Initial token supply: ${initialTokenSupply}`);
  console.error(`Initial ETH supply: ${initialEthSupply}`);
};
exports.deployUniswap = async (owner) => {
  console.error("Deploying UniswapFactory...");
  const UniswapFactory = new ethers_1.ContractFactory(
    UniswapV2Factory_json_1.default.abi,
    UniswapV2Factory_json_1.default.bytecode,
    owner
  );
  const factory = await UniswapFactory.deploy(await owner.getAddress());
  console.error(`UniswapFactory contract address: ${factory.address}`);
  console.error("Deploying WETH...");
  const WETHFactory = new ethers_1.ContractFactory(
    WETH9_json_1.default.abi,
    WETH9_json_1.default.bytecode,
    owner
  );
  const weth = await WETHFactory.deploy();
  console.error(`WETH contract address: ${weth.address}`);
  console.error("Deploying UniswapV2Router...");
  const UniswapV2Router = new ethers_1.ContractFactory(
    UniswapV2Router02_json_1.default.abi,
    UniswapV2Router02_json_1.default.bytecode,
    owner
  );
  const router = await UniswapV2Router.deploy(factory.address, weth.address);
  console.error(`UniswapV2Router contract address: ${router.address}`);
  return router;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95X3VuaXN3YXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVwbG95L2RlcGxveV91bmlzd2FwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQSx5R0FBZ0Y7QUFDaEYsbUdBQTBFO0FBQzFFLHdGQUEyRDtBQUMzRCxnSEFBdUY7QUFDdkYsa0RBQWtEO0FBQ2xELG1DQUEyRDtBQUMzRCx5RUFBNEM7QUFFL0IsUUFBQSxVQUFVLEdBQUcsS0FBSyxFQUM3QixLQUFhLEVBQ2IsTUFBZ0IsRUFDaEIsS0FBZSxFQUNmLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxFQUNyQyxnQkFBZ0IsR0FBRyxHQUFHLElBQUksR0FBRyxFQUM3QixFQUFFO0lBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBUSxDQUFDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLCtCQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0RixNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFRLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsb0JBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFakUsSUFBSSxDQUFDLG9CQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3RHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQzdFLE9BQU87S0FDUjtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFB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
