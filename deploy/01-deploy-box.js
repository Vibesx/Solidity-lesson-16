const { network } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../helper-functions");

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	log("-----------------------");
	const box = await deploy("Box", {
		from: deployer,
		args: [],
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
		// we will deploy the Box contract via a proxy
		proxy: {
			// docs: https://github.com/wighawag/hardhat-deploy/blob/master/solc_0.8/openzeppelin/proxy/transparent/TransparentUpgradeableProxy.sol
			proxyContract: "OpenZeppelinTransparentProxy",
			// instead of having an admin address for the proxyContract, we'll have it be owned by an admin contract (considered best practice)
			viaAdminContract: {
				name: "BoxProxyAdmin",
				artifact: "BoxProxyAdmin",
			},
		},
	});

	// Be sure to check out the hardhat-deploy examples to use UUPS proxies!
	// https://github.com/wighawag/template-ethereum-contracts

	// Verify the deployment
	if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
		log("Verifying...");
		await verify(box.address, []);
	}
	log("----------------------------------------------------");
};
