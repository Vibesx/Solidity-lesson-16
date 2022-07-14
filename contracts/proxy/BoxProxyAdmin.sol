// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

// docs: https://github.com/wighawag/hardhat-deploy/blob/master/solc_0.8/openzeppelin/proxy/transparent/ProxyAdmin.sol
contract BoxProxyAdmin is ProxyAdmin {
	constructor(
		address /* owner */
	) ProxyAdmin() {}
}
