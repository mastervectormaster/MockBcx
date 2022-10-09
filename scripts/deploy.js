const hre = require('hardhat');
var fs = require('fs');

async function compile () {
    await hre.run('compile');
}

async function main () {
    await compile();
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = (await deployer.getBalance()).toString()
    console.log('Deployer Address is ', deployer.address);
    console.log('Account balance is ', accountBalance);

    const mockBcxContract = await hre.ethers.getContractFactory("MockBcx");
    const deploymockBcxContract = await mockBcxContract.deploy();
    await deploymockBcxContract.deployed();
    console.log("Mock Bcx Contract deployed at ", deploymockBcxContract.address);

    const bridgeContract = await hre.ethers.getContractFactory("Bridge");
    const deployBridgeContract = await bridgeContract.deploy();
    await deployBridgeContract.deployed();
    console.log("Bridge Contract deployed at ", deployBridgeContract.address);
}

main()
.then(() => process.exit(0))
.catch((err) => {
    console.log(err);
    process.exit(1);
})
