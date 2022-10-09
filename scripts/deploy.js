const hre = require("hardhat");
var fs = require("fs");

async function compile() {
  await hre.run("compile");
}

async function main() {
  await compile();
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = (await deployer.getBalance()).toString();
  console.log("Deployer Address is ", deployer.address);
  console.log("Account balance is ", accountBalance);

  const mockBcxContract = await hre.ethers.getContractFactory("MockBcx");
  const deploymockBcxContract = await mockBcxContract.deploy();
  await deploymockBcxContract.deployed();
  console.log("Mock Bcx Contract deployed at ", deploymockBcxContract.address);

  const bridgeContract = await hre.ethers.getContractFactory("Bridge");
  const deployBridgeContract = await bridgeContract.deploy();
  await deployBridgeContract.deployed();
  console.log("Bridge Contract deployed at ", deployBridgeContract.address);


  // save deployed address to deployedAddresses.json

  const addresses = {
    MockBcx: deploymockBcxContract.address,
    Bridge: deployBridgeContract.address,
  };

  fs.writeFileSync("./deployedAddress.json", JSON.stringify(addresses), (err) => {
    if (err) {
      console.error("Error! while creating file: ", err);
    } else {
      console.log("Sucess~!");
    }
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
