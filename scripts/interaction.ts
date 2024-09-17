import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    

    const DAI_Contract = await ethers.getContractAt("IERC20", DAI);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router02", ROUTER_ADDRESS, impersonatedSigner);

    const amountTokenDesired = ethers.parseUnits("100", 6);
    const amountTokenMin = ethers.parseUnits("99", 6);
    const amountETHMin = ethers.parseUnits("0", 18);
    const ETHAmount = ethers.parseUnits("20", 18);
    const to = impersonatedSigner.address;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
    
    await USDC_Contract.approve(ROUTER_ADDRESS, amountTokenDesired);

    // console.log("Add Liquidity ETH Scripting")
    // console.log("============================================================")
    const usdcBefore = await USDC_Contract.balanceOf(impersonatedSigner.address);
    // const ethBefore = await ethers.provider.getBalance()

    const tx = await ROUTER.addLiquidityETH(
        USDC,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        to,
        deadline,
        {
          value: ETHAmount,
        });
    
        tx.wait();

    const usdcAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    console.log("Add Liquidity ETH Scripting")
    console.log(tx);
    console.log("USDC Before Adding Liquidity: "+usdcBefore)
    console.log("USDC After Adding Liquidity: "+usdcAfter)

    const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const WETH_Contract = await ethers.getContractAt("IERC20", WETH, impersonatedSigner);

    const amountOutMin = ethers.parseUnits("0.001", 18);
  
    const path = [WETH, DAI];

    await WETH_Contract.approve(ROUTER, ethers.parseEther("2") );

    console.log("Starting ETH to DAI swap process...");
    
    const DAIBalBeforeSwap = await WETH_Contract.balanceOf(impersonatedSigner.address);
    
    const swaptx = await ROUTER.swapExactETHForTokens(
        amountOutMin,
        path,
        impersonatedSigner.address,
        deadline,
        { value: ethers.parseEther("0.1") }  
    );

    await swaptx.wait();
    const DAIBalAfter = await WETH_Contract.balanceOf(impersonatedSigner.address);
    

    console.log("==========================================================================================")
    console.log("Swap exact token for token")
    console.log(swaptx)
    console.log("DAI Balance Before Swap: "+DAIBalBeforeSwap)
    console.log("DAI Balance After Swap: "+DAIBalAfter)




    

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});