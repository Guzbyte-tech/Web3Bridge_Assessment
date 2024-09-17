const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer Address: ${deployer.address}`);

  // Define the UniswapV2 Router02 contract address
  const uniswapRouterAddress = "0xUniswapRouterAddress";  // Replace with actual router address

  // Attach to the Uniswap Router contract ABI
  const UniswapV2RouterABI = [
    // Include only the function we are interacting with
    "function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)"
  ];

  // Connect to the Uniswap Router contract
  const router = new ethers.Contract(uniswapRouterAddress, UniswapV2RouterABI, deployer);

  // Define your token address and the liquidity token (LP token) amount you want to remove
  const tokenAddress = "0xYourTokenAddress";  // Replace with actual token address
  const liquidity = ethers.utils.parseUnits("1.0", 18);  // Amount of LP tokens to remove
  const amountTokenMin = ethers.utils.parseUnits("0.1", 18); // Minimum amount of tokens to receive
  const amountETHMin = ethers.utils.parseUnits("0.01", 18); // Minimum amount of ETH to receive
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 20 minutes from now

  // Address where the tokens and ETH will be sent
  const to = deployer.address;

  // Approve the router to spend your LP tokens
  const lpTokenAddress = "0xYourLPTokenAddress"; // Replace with actual LP token address
  const lpTokenABI = [
    "function approve(address spender, uint256 amount) public returns (bool)"
  ];
  const lpToken = new ethers.Contract(lpTokenAddress, lpTokenABI, deployer);
  const approveTx = await lpToken.approve(uniswapRouterAddress, liquidity);
  await approveTx.wait();
  console.log(`Approved ${liquidity.toString()} LP tokens to Uniswap Router.`);

  // Call removeLiquidityETH function
  const tx = await router.removeLiquidityETH(
    tokenAddress,
    liquidity,
    amountTokenMin,
    amountETHMin,
    to,
    deadline,
    {
      gasLimit: 300000, // Adjust based on the gas needed
    }
  );

  console.log("Transaction sent, waiting for confirmation...");
  const receipt = await tx.wait();
  console.log("Liquidity removed. Transaction hash:", receipt.transactionHash);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
