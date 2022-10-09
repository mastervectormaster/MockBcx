const hre = require('hardhat');
var fs = require('fs');

async function compile () {
    await hre.run('compile');
}

async function main () {
    await compile();
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = (await deployer.getBalance()).toString()
    console.log('compile result is ', deployer.address);
    console.log('Account balance is ', accountBalance);

    const targetContract = await hre.ethers.getContractFactory("Gravity");
    // const deployContract = await targetContract.deploy([
    //     "0xaf6Da626590162e4cCcfc274304d238f0597fF7e",
    //     "0x0A0c2601C7874E77a401D91f8085DD07b040E595",
    //     "0x724f337bF0Fa934dB9aa3ec6dEa49B03c54AD3cc"
    // ]);
    const deployContract = await targetContract.deploy();
    await deployContract.deployed();
    const temp = {
        address: deployContract.address,
    }
    const json = JSON.stringify(temp);
    console.log('result of json is ', json);
    fs.writeFileSync('./deployedAddress.json', json, (err) => {
        if(err) {
            console.log('ERROR! while creating file: ', err);
        } else {
            console.log('result is ', json)
        }
    });
    console.log("Contract deployed at ", deployContract.address);
}

main()
.then(() => process.exit(0))
.catch((err) => {
    console.log(err);
    process.exit(1);
})
