const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

const a = async () => {
  const RPC_ENDPOINT = "https://rpc-mumbai.matic.today";
  const CHAIN_ID = 80001;
  const deployedAddrs = JSON.parse(fs.readFileSync("deployedAddress.json"));
  const bcxContractAddr = deployedAddrs["MockBcx"];
  const bridgeContractAddr = deployedAddrs["Bridge"];

  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT, CHAIN_ID);
  const signer = new ethers.Wallet(
    `0x${process.env.POLYGON_PRIVATE_KEY}`,
    provider
  );

  const bcxAbi = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
  ];

  const bridgeAbi = [
    "function sendToCosmos(address, string, uint256) public",
  ]

  const bcxContract = new ethers.Contract(bcxContractAddr, bcxAbi, signer);

  await bcxContract.approve(bridgeContractAddr, 10000);
  
  const bridgeContract = new ethers.Contract(bridgeContractAddr, bridgeAbi, signer);

  console.log(await bridgeContract.sendToCosmos(bcxContractAddr, 'cosmos123', 10000))
};

a();
