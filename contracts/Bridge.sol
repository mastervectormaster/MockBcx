// contracts/Bridge.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

error InvalidSendToCosmos();

contract Gravity is ReentrancyGuard {
	using SafeERC20 for IERC20;

	event SendToCosmosEvent(
		address indexed _tokenContract,
		address indexed _sender,
		string _destination,
		uint256 _amount
	);

	function sendToCosmos(
		address _tokenContract,
		string calldata _destination,
		uint256 _amount
	) external nonReentrant {
		// we snapshot our current balance of this token
		uint256 ourStartingBalance = IERC20(_tokenContract).balanceOf(address(this));

		// attempt to transfer the user specified amount
		IERC20(_tokenContract).safeTransferFrom(msg.sender, address(this), _amount);

		// check what this particular ERC20 implementation actually gave us, since it doesn't
		// have to be at all related to the _amount
		uint256 ourEndingBalance = IERC20(_tokenContract).balanceOf(address(this));

		// a very strange ERC20 may trigger this condition, if we didn't have this we would
		// underflow, so it's mostly just an error message printer
		if (ourEndingBalance <= ourStartingBalance) {
			revert InvalidSendToCosmos();
		}

		// emit to Cosmos the actual amount our balance has changed, rather than the user
		// provided amount. This protects against a small set of wonky ERC20 behavior, like
		// burning on send but not tokens that for example change every users balance every day.
		emit SendToCosmosEvent(
			_tokenContract,
			msg.sender,
			_destination,
			ourEndingBalance - ourStartingBalance
		);
	}

	constructor() {}
}
