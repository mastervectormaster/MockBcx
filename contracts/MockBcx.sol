// contracts/MockBcx.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockBcx is ERC20 {

    // Define the supply of MockBcx: 6,000,000 
    uint256 constant initialSupply = 6000000 * (10**18);

    // Constructor will be called on contract creation
    constructor() ERC20("MockBcx", "bcx") {
        _mint(msg.sender, initialSupply);
    }
}