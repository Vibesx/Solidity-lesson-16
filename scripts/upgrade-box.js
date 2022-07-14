// we'll do it the manual way

const { ethers } = require("hardhat");

async function main() {
	const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
	// hardhat will name the implementation <name_of_contract>_Proxy
	const transparentProxy = await ethers.getContract("Box_Proxy");

	const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address);
	const versionV1 = await proxyBoxV1.version();
	console.log(versionV1.toString());

	const boxV2 = await ethers.getContract("BoxV2");
	// upgrade our tranparentProxy to boxV2; docs for upgrade: https://github.com/wighawag/hardhat-deploy/blob/master/solc_0.8/openzeppelin/proxy/transparent/TransparentUpgradeableProxy.sol line 96
	const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
	await upgradeTx.wait(1);

	// we're going to get the BoxV2 abi, but load it at tranparentProxy address
	// this way ethers knows we're going to call all functions on the tranaparentProxy address, but it's going to have the abi of BoxV2
	const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
	const versionV2 = await proxyBoxV2.version();
	console.log(versionV2.toString());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
