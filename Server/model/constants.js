 const Enum=require("enum");
module.exports={
    tokenStatus: new Enum(['Pending','Deployed','Verified','Rejected']),
    supplyTypeList:new Enum(['Fixed','10K','Unlimited','Capped']),
    accessTypeList:new Enum(['None','Ownable','Role Based']),
    transferTypeList:new Enum(['Unstoppable','Pausable']),
    tokenTypeList : new Enum(['ERC20','ERC721','ERC1155','HelloERC20','SimpleERC20','StandardERC20','BurnableERC20','MintableERC20','PausableERC20','CommonERC20','UnlimitedERC20','AmazingERC20','PowerfulERC20']),
    networkList : new Enum(['Main Ethereum Network','BSC','Polygon','Ropsten Test Network','Rinkeby Test Network','Kovan Test Network','Goerli Test Network','Polygon Testnet']),
    contractTp : new Enum(['ERC20', 'ERC721', 'ERC1155'])
}