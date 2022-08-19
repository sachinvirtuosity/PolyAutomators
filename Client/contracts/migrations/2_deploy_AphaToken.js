const AlphaToken = artifacts.require("AlphaToken");

module.exports = function (deployer) {
    const tokenName="";
    const tokenSymbol="";
  deployer.deploy(AlphaToken,tokenName, tokenSymbol);
};
