#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const experimental_1 = require("@ethersproject/experimental");
const deploy_1 = require("./deploy");
const { ETHEREUM_HOST, INFURA_API_KEY, NETWORK, PRIVATE_KEY, ESCAPE_BLOCK_LOWER = '4560', // window of 1hr every 20hrs (escape in last 240 blocks of every 4800)
ESCAPE_BLOCK_UPPER = '4800', } = process.env;
function getSigner() {
    if (INFURA_API_KEY && NETWORK && PRIVATE_KEY) {
        console.error(`Infura network: ${NETWORK}`);
        const provider = new ethers_1.ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY);
        return new experimental_1.NonceManager(new ethers_1.ethers.Wallet(PRIVATE_KEY, provider));
    }
    else if (ETHEREUM_HOST) {
        console.error(`Json rpc provider: ${ETHEREUM_HOST}`);
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(ETHEREUM_HOST);
        return new experimental_1.NonceManager(provider.getSigner(0));
    }
}
async function main() {
    const [, , initialFee, feeDistributorAddress, uniswapRouterAddress] = process.argv;
    const signer = getSigner();
    if (!signer) {
        throw new Error('Failed to create signer. Set ETHEREUM_HOST or INFURA_API_KEY, NETWORK, PRIVATE_KEY.');
    }
    const { rollup, priceFeeds } = await deploy_1.deploy(+ESCAPE_BLOCK_LOWER, +ESCAPE_BLOCK_UPPER, signer, initialFee, feeDistributorAddress, uniswapRouterAddress);
    console.log(`export ROLLUP_CONTRACT_ADDRESS=${rollup.address}`);
    console.log(`export PRICE_FEED_CONTRACT_ADDRESSES=${priceFeeds.map(p => p.address).join(',')}`);
}
main().catch(error => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVwbG95L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUF3QztBQUN4Qyw4REFBMkQ7QUFDM0QscUNBQWtDO0FBRWxDLE1BQU0sRUFDSixhQUFhLEVBQ2IsY0FBYyxFQUNkLE9BQU8sRUFDUCxXQUFXLEVBQ1gsa0JBQWtCLEdBQUcsTUFBTSxFQUFFLHNFQUFzRTtBQUNuRyxrQkFBa0IsR0FBRyxNQUFNLEdBQzVCLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUVoQixTQUFTLFNBQVM7SUFDaEIsSUFBSSxjQUFjLElBQUksT0FBTyxJQUFJLFdBQVcsRUFBRTtRQUM1QyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLElBQUksZUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlFLE9BQU8sSUFBSSwyQkFBWSxDQUFDLElBQUksZUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFXLENBQUMsQ0FBQztLQUM3RTtTQUFNLElBQUksYUFBYSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNyRSxPQUFPLElBQUksMkJBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7QUFDSCxDQUFDO0FBRUQsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxDQUFDLEVBQUUsQUFBRCxFQUFHLFVBQVUsRUFBRSxxQkFBcUIsRUFBRSxvQkFBb0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFFbkYsTUFBTSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7SUFDM0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMscUZBQXFGLENBQUMsQ0FBQztLQUN4RztJQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxlQUFNLENBQ3pDLENBQUMsa0JBQWtCLEVBQ25CLENBQUMsa0JBQWtCLEVBQ25CLE1BQU0sRUFDTixVQUFVLEVBQ1YscUJBQXFCLEVBQ3JCLG9CQUFvQixDQUNyQixDQUFDO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xHLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDIn0=