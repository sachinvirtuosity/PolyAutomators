const express = require("express");
const moment = require("moment");

const mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const config = require("../config.js");
const MONGODB_URI = config.mongodburi;
const jverify = require("../model/JWT.js");
const constants = require("../model/constants.js");
const connection = require("../model/function.js");
var router = express.Router();
const Enum = require("enum");
const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
var connectionURL = "https://rpc-mumbai.maticvigil.com/v1/7c71994fb9d6dd7154539e4a1dc56ff96e5f3508";//"https://ropsten.infura.io/v3/1f32a6562a8c4cae9f9d32c4ed179314";//"https://rinkeby.infura.io/v3/b140d24d3a5744e0b9b98848003f07fe";
const re = require('express/lib/response');
var web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));
Enum.register();


mongoClient.connect(
    MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    function (error, client) {
        if (error) {
            throw error;
        }
        database = client.db(process.env.DATABASE);
    }
);
//varify jwt
router.use('*',async (request, response, next) => {
  if (!database) {
    response.send("DB not initialized yet");
    return;
  }else{
    if(request.method=="GET"){
        next();
    }else{
      await jverify.validateToken(request,response).then((data)=>{
      if(!data.status){
        response.send({msg:"Unauthenticated request",status:0});
             return; 
      } else {
            next()
          }
        });
    }
  }
})
//API for country list
router.get("/getCountryList", async (req, res) => {
    console.log(req.method);
    database && database.collection(process.env.COUNTRY_LIST)
        .find({}).sort({ countryName: 1 }).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            console.log(result);
            res.send(result);
        });
});
//API's to get  token details for user
router.get("/getTokenDetailsbyUser/:userId/:pg", async (req, res) => {
    var pageNumber = parseInt(req.params.pg);
    var userId = req.params.userId;
    database && database.collection(process.env.TOKEN_DETAILS)
        .aggregate([
            { $match: { 'userName': userId } },
            {
                $lookup: {
                    from: process.env.BILLING_DETAILS,
                    localField: "_id",
                    foreignField: "tokenId",

                    // pipeline:[
                    //     {
                    //         $addFields: {
                    //             country: {
                    //                 $toObjectId: "country"
                    //             }
                    //         }
                    //     },
                    //     {
                    //         $lookup: {
                    //             from: process.env.COUNTRY_LIST,
                    //             localField: "country",
                    //             foreignField: "_id",
                    //             as: "countryDetails"
                    //         }
                    //     },
                    // ],
                    as: "billingDetails"
                }
            },

            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { _id: -1 } },

                        { $skip: (pageNumber > 0 ? ((pageNumber - 1) * parseInt(process.env.TOKEN_PER_PAGE)) : 0) },
                        { $limit: (parseInt(process.env.TOKEN_PER_PAGE)) }]
                }
            }

        ]).toArray(async (error, result) => {
            if (error) {
                console.log(error);
                return res.send(error);
            }
            if (Object.keys(result[0].metadata).length > 0) {
                let totalcount = result[0].metadata[0].total;
                let numberOfPages = Math.ceil(parseInt(totalcount) / parseInt(process.env.TOKEN_PER_PAGE));
                result[0].metadata[0].numberOfPages = numberOfPages;
            }
            if (Object.keys(result[0].data).length > 0) {
                result[0].data.map(data => {
                    data.supplyType = constants.supplyTypeList.get(data.supplyType).key;
                    data.accessType = constants.supplyTypeList.get(data.accessType).key;
                    data.transferType = constants.transferTypeList.get(data.transferType).key;
                    data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                    data.network = constants.networkList.get(data.network).key;
                    data.status = constants.tokenStatus.get(data.status).key;
                    data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");
                    data.isMetamask = data.isMetamask ? 'Metamask' : "-";
                    if(data.network=="Polygon Testnet"){
                        data.baseurl="https://mumbai.polygonscan.com/tx/";
                    }else if(data.network=="Polygon"){
                        data.baseurl="https://polygonscan.com/tx/"
                    }else if(data.network=="Ropsten Test Network"){
                        data.baseurl="https://ropsten.etherscan.io/tx/"
                    }

                })
            }
            res.json(result[0]);
        });

});
router.post("/createTokenviametamask", async (request, response) => {
    console.log(request.body);
    let alp_regex = new RegExp('[a-zA-Z]');
    switch (true) {
        case request.body.tokenName == '':
            return response.send({ msg: "Token Name Required" });
            break;
        case request.body.tokenSymbol == '':
            return response.send({ msg: "Token Symbol Required" });
            break;
        case (request.body.tokenSymbol).toString().length >= 6:
            return response.send({ msg: "Token Symbol should contain max 5 characters" });
            break;
        //  case isNaN(parseInt(request.body.token_symbol)) == true:
        case (alp_regex.test(request.body.tokenSymbol)) == false:
            return response.send({ msg: "Token Symbol should contain alphabets Only" });
            break;
        // case (parseInt(request.body.tokenDecimal) <= 9 || parseInt(request.body.tokenDecimal) >= 100):
        //     return response.send({ msg: "Token Decimal Should be between 10-99" });
        //     break;
        case isNaN(parseInt(request.body.tokenDecimal)) == true:
            return response.send({ msg: "Token Decimal should contain Numbers Only" });
            break;
        case isNaN(parseInt(request.body.initialSupply)) == true:
            return response.send({ msg: "Initial supply should contain Numbers Only" });
            break;
        case (parseInt(request.body.initialSupply) <= 0):
            return response.send({ msg: "Initial supply Should be more than 1" });
    }

    let query = { 'tokenName': request.body.tokenName }
    var collection = database.collection(
        process.env.TOKEN_DETAILS
    );
    // collection.findOne(query, async (err, result) => {
    //     if (err) {
    //         return response.send({status:2,msg:err});
    //     }
    //     if (result != null) {
    //         response.send({ status:2,msg: "Token Name Already Exists" });
    //     } else {

    let newToken = {
        tokenName: request.body.tokenName,
        tokenSymbol: request.body.tokenSymbol,
        tokenDecimal: request.body.tokenDecimal,
        initialSupply: request.body.initialSupply,
        tokenSupply: request.body.tokenSupply,
        supplyType: constants.supplyTypeList.get(request.body.supplyType).value,
        accessType: constants.accessTypeList.get(request.body.accessType).value,
        transferType: constants.transferTypeList.get(request.body.transferType).value,
        varifySource: request.body.varifySource,
        removeCopy: request.body.removeCopy,
        burnable: request.body.burnable,
        mintable: request.body.mintable,
        erc: request.body.erc,
        tokenRecover: request.body.tokenRecover,
        tokenType: constants.tokenTypeList.get(request.body.tokenType).value,
        network: constants.networkList.get(request.body.network).value,
        status: constants.tokenStatus.get(request.body.status).value,
        userName: request.body.userName,
        commisionFee: request.body.commisionFee,
        gasFee: request.body.gasFee,
        subscriptionFee: request.body.subscriptionFee,
        createdOn: new Date(),
        createdBy: request.body.createdBy
    };
    try {
        collection.insertOne(newToken, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

                // let ceatedRecaipt = await deploy(request.body.tokenName,request.body.tokenSymbol);
                // var setQuery = {};
                // if (ceatedRecaipt.error != null) {
                //     let temp1 = ceatedRecaipt.error.toString();
                //     console.log("response=", temp1);
                //     setQuery = {
                //         txHash: null,
                //         contractAddress: null,
                //         status: constants.tokenStatus.get("Pending").value,
                //         reason: temp1,
                //         updatedOn: new Date(),
                //         updatedBy: request.body.userName
                //     };

                // } else {
                //     setQuery = {
                //         txHash: ceatedRecaipt.data["transactionHash"],
                //         contractAddress: ceatedRecaipt.data["contractAddress"],
                //         status: constants.tokenStatus.get("Deployed").value,
                //         updatedOn: new Date(),
                //         updatedBy: request.body.userName,
                //         reason: ""
                //     };
                // }
                // collection.updateOne(
                //     { "_id": new ObjectId(result.insertedId) },
                //     {
                //         $set: setQuery
                //     },

                //     {
                //         upsert: false,
                //     },
                //     (error, result) => {
                //         if (error) {
                //             console.log(error);
                //             response.send({status:2,msg:error});
                //         } else {
                //             console.log(result);
                let msgtxt = "Token Created With Contract Address " + request.body.contractAddress;
                response.send({ status: 1, msg: msgtxt });
                //         }

                //     }
                // );



            }

        });
    } catch (ex) {
        response.send({ status: 1, msg: "Token Created" });
    }
    //     }
    // });

});
//creat and deploy new token
router.post("/createToken", async (request, response) => {
    console.log(request.body);
    let alp_regex = new RegExp('[a-zA-Z]');
    switch (true) {
        case request.body.tokenName == '':
            return response.send({ msg: "Token Name Required" });
            break;
        case request.body.tokenSymbol == '':
            return response.send({ msg: "Token Symbol Required" });
            break;
        case (request.body.tokenSymbol).toString().length >= 6:
            return response.send({ msg: "Token Symbol should contain max 5 characters" });
            break;
       
        case (alp_regex.test(request.body.tokenSymbol)) == false:
            return response.send({ msg: "Token Symbol should contain alphabets Only" });
            break;
      
        case isNaN(parseInt(request.body.tokenDecimal)) == true:
            return response.send({ msg: "Token Decimal should contain Numbers Only" });
            break;
        case isNaN(parseInt(request.body.initialSupply)) == true:
            return response.send({ msg: "Initial supply should contain Numbers Only" });
            break;
        case (parseInt(request.body.initialSupply) <= 0):
            return response.send({ msg: "Initial supply Should be more than 1" });
    }

    let query = { 'tokenName': request.body.tokenName }
    var collection = database.collection(
        process.env.TOKEN_DETAILS
    );
   
    let newToken = {
        tokenName: request.body.tokenName,
        tokenSymbol: request.body.tokenSymbol,
        tokenDecimal: request.body.tokenDecimal,
        initialSupply: request.body.initialSupply,
        tokenSupply: request.body.tokenSupply,
        supplyType: constants.supplyTypeList.get(request.body.supplyType).value,
        accessType: constants.accessTypeList.get(request.body.accessType).value,
        transferType: constants.transferTypeList.get(request.body.transferType).value,
        varifySource: request.body.varifySource,
        removeCopy: request.body.removeCopy,
        burnable: request.body.burnable,
        mintable: request.body.mintable,
        erc: request.body.erc,
        tokenRecover: request.body.tokenRecover,
        tokenType: constants.tokenTypeList.get(request.body.tokenType).value,
        network: constants.networkList.get(request.body.network).value,
        status: constants.tokenStatus.get(request.body.status).value,
        userName: request.body.userName,
        commisionFee: request.body.commisionFee,
        gasFee: request.body.gasFee,
        subscriptionFee: request.body.subscriptionFee,
        createdOn: new Date(),
        createdBy: request.body.createdBy,
        txHash: request.body.txHash == undefined ? null : request.body.txHash,
        contractAddress: request.body.contractAddress == undefined ? null : request.body.contractAddress,
        reason: request.body.reason == undefined ? null : request.body.reason,
        isMetamask: request.body.deployViaMetamask
    };
    try {
        collection.insertOne(newToken, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {
                let billingDtl = {
                    contractAddress: request.body.contractAddress,
                    tokenId: result.insertedId,
                    userName: request.body.userName,
                    createdBy: request.body.createdBy,
                };
                const billingResp = await addBillingDetails(request.body.billingDetails, billingDtl);
                if (request.body.deployViaMetamask == false) {
                    
                    let ceatedRecaipt = await deploy(request.body);
                    var setQuery = {};
                    if (ceatedRecaipt.error != null) {
                        let temp1 = ceatedRecaipt.error.toString();
                        console.log("response=", temp1);
                        setQuery = {
                            txHash: null,
                            contractAddress: null,
                            status: constants.tokenStatus.get("Pending").value,
                            reason: temp1,
                            updatedOn: new Date(),
                            updatedBy: request.body.userName
                        };

                    } else {
                        setQuery = {
                            txHash: ceatedRecaipt.data["transactionHash"],
                            contractAddress: ceatedRecaipt.data["contractAddress"],
                            status: constants.tokenStatus.get("Deployed").value,
                            updatedOn: new Date(),
                            updatedBy: request.body.userName,
                            reason: ""
                        };
                    }
                    collection.updateOne(
                        { "_id": new ObjectId(result.insertedId) },
                        {
                            $set: setQuery
                        },

                        {
                            upsert: false,
                        },
                        (error, result) => {
                            if (error) {
                                console.log(error);
                                response.send({ status: 2, msg: error });
                            } else {
                                console.log(result);
                                let msgtxt = "";
                                if (ceatedRecaipt.data != null) {
                                    msgtxt = "Token Created With Contract Address " + ceatedRecaipt.data["contractAddress"];
                                    response.send({ status: 1, msg: msgtxt, contractAddress: ceatedRecaipt.data["contractAddress"] });
                                } else {
                                    msgtxt = "Token Created with deployment pending due to " + ceatedRecaipt.error.toString();
                                    response.send({ status: 1, msg: msgtxt, contractAddress: "" });
                                }


                            }

                        }
                    );

                } else {
                    var txhash = request.body.txHash!=null?(request.body.txHash).toString():request.body.txHash;
                    
                    setTimeout(async () => {
                      
                        if(request.body.txHash!=null){
                        if(request.body.network=="Polygon"){
                            connectionURL="https://rpc-mainnet.maticvigil.com/v1/7c71994fb9d6dd7154539e4a1dc56ff96e5f3508";
                            web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));
                        }
                        const createReceipt = await web3.eth.getTransactionReceipt(
                            txhash
                        );
                       
                        if(createReceipt!=null){
                        setQuery = {

                            contractAddress: createReceipt.contractAddress,

                        };
                        collection.updateOne(
                            { "_id": new ObjectId(result.insertedId) },
                            {
                                $set: setQuery
                            },

                            {
                                upsert: false,
                            },
                            (error, result) => {
                               
                            });
                        }
                    
                    }
                    }, 30000)

                    let errMsg = request.body.reason == null ? '' : " Token Created with deployment pending due to " + request.body.reason;
                    let msgtxt = "Token Created With Contract Address " + request.body.contractAddress + errMsg;
                    if (request.body.reason == null) {
                        msgtxt = "Token Created With Contract Address " + request.body.contractAddress;
                    } else {
                        msgtxt = "Token Created with deployment pending due to " + request.body.reason;
                    }
                    response.send({ status: 1, msg: msgtxt, contractAddress: request.body.contractAddress, });
                }

            }

        });
    } catch (ex) {
        response.send({ status: 1, msg: "Token Created" });
    }
    

});
//API's for SubscriptionFee
router.get("/getSubscriptionFee/:contract/:network", async (req, res) => {
    let query = {
        contractType: constants.tokenTypeList.get(req.params.contract).value,
        network: constants.networkList.get(req.params.network).value,

    };
    database && database.collection(process.env.SUBSCRIPTION_FEE)
        .find(query).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            result.map(data => {
                data.contractType = constants.tokenTypeList.get(data.contractType).key;
                data.network = constants.networkList.get(req.params.network).key
            });
            res.send(result);
        });
});
//API to get token details by token ID
router.get("/getTokenDetailsbyId/:tokenId", async (req, res) => {
    var tokenId = req.params.tokenId;
    database && database.collection(process.env.TOKEN_DETAILS)
        .aggregate([

            {
                $match: {
                    _id: new ObjectId(tokenId)
                }
            },
            {
                $addFields: {
                    subscriptionFee: {
                        $toObjectId: "$subscriptionFee"
                    }
                }
            },

            {
                $lookup: {
                    from: process.env.SUBSCRIPTION_FEE,
                    localField: "subscriptionFee",
                    foreignField: "_id",
                    as: "subscriptionFees"
                }
            }
        ])
        .toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            result.map(data => {
                data.supplyType = constants.supplyTypeList.get(data.supplyType).key;
                data.accessType = constants.supplyTypeList.get(data.accessType).key;
                data.transferType = constants.transferTypeList.get(data.transferType).key;
                data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                data.network = constants.networkList.get(data.network).key;
                data.isMetamask = data.isMetamask ? 'Metamask' : "-";

            })
            res.send(result);
        });

});
//APi to add billing details
router.post("/addBillingDetails/", async (req, res) => {
    var data = request.body;

    let billingDtls = {
        walletAddress: data.walletAddress,
        legalName: data.legalName,
        emailid: data.emailid,
        billingAddress: data.billingAddress,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        country: data.country,
        taxId: data.taxId,
        taxRegNumber: data.taxRegNumber,
        userId: data.userName,
        tokenId: data.tokenId,
        createdBy: data.userId,
        createdOn: new Date()
    };
    var collection = database.collection(
        process.env.BILLING_DETAILS
    );

    try {
        collection.insertOne(billingDtls, async (error, result) => {
            if (error) {
                return response.send({ status: 2, msg: error });
            } else {

            }

        });
    } catch (ex) {
        response.send({ status: 1, msg: "Token Created" });
    }


});
//API to get the ABI by Token Type 
router.get("/getContractValues/:featueList", async (req, res) => {
    var featueList = req.params.featueList;
    const data = await selectAbi(featueList);
    res.send(data);

});
//Function to get the byte code and ABI by token type
const selectAbi = async (tokentype) => {
    try {
        /**
         * COMPILATION SCRIPT
         */
        var filename = "";
        var files = "";
        var input = {}
        var source = "";
        var sourceObj = {};

        switch (true) {
            case tokentype == "HelloERC20":
                filename = "HelloERC20.sol";
                break;
            case tokentype == "SimpleERC20":
                filename = "SimpleERC20.sol";
                break;
            case tokentype == "StandardERC20":
                filename = "StandardERC20.sol";
                break;
            case tokentype == "BurnableERC20":
                filename = "BurnableERC20.sol";
                break;
            case tokentype == "MintableERC20":
                filename = "MintableERC20.sol";
                break;
            case tokentype == "PausableERC20":
                filename = "PausableERC20.sol";
                break;
            case tokentype == "CommonERC20":
                filename = "CommonERC20.sol";
                break;
            case tokentype == "UnlimitedERC20":
                filename = "UnlimmitedERC20.sol";
                break;
            case tokentype == "erc20Airdrop":
                filename = "erc20Airdrop.sol";
                break;
            default:
                filename = "MyToken.sol";
                break;
        }

        source = fs.readFileSync('./model/' + filename, 'UTF-8');
        sourceObj[filename] = {
            content: source,
        };
        console.log(filename);
       
        input = {
            language: 'Solidity',
            sources: sourceObj,
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };
        var output = JSON.parse(solc.compile(JSON.stringify(input)));
        let contractObj="MyToken";
        if(tokentype=="erc20Airdrop"){
            contractObj="FlamToken";
        }
        const contractFile = output.contracts[filename][contractObj];
        const byteCode = contractFile.evm.bytecode.object;
        const contractABI = contractFile.abi;
        /**
         * DEPLOYMENT SCRIPT
         * 
         */
        return ({
            "byteCode": byteCode,

            "contractABI": contractABI
        })
    } catch (ex) {
        console.log(ex);
    }

}
//function to deploy the token
const deploy = async (tokenObj) => {
    var returnData = {};
    try {

        const abiResp = await selectAbi(tokenObj.tokenType);
        var argdata=[];
        if(tokenObj.tokenType=="SimpleERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol,tokenObj.address,tokenObj.tokenDecimal];
        }else if(tokenObj.tokenType=="StandardERC20" || tokenObj.tokenType=="BurnableERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol,tokenObj.address,tokenObj.initialSupply,tokenObj.tokenDecimal];
        }else if(tokenObj.tokenType=="HelloERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol,tokenObj.address];
        }else if(tokenObj.tokenType=="MintableERC20" ||tokenObj.tokenType=="PausableERC20" ||tokenObj.tokenType=="CommonERC20" || tokenObj.tokenType=="UnlimitedERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol,tokenObj.tokenDecimal];
        }else if(tokenObj.tokenType=="AmazingERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol];
        }else if(tokenObj.tokenType=="PowerfulERC20"){
            argdata=[tokenObj.tokenName, tokenObj.tokenSymbol];
        }
        if(request.body.network=="Polygon"){
            connectionURL="https://rpc-mainnet.maticvigil.com/v1/7c71994fb9d6dd7154539e4a1dc56ff96e5f3508";
            web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));
        }
       
        const incrementer = new web3.eth.Contract(abiResp.contractABI);
        const incrementerTx = incrementer.deploy({
            data: abiResp.byteCode,
            arguments: argdata
        });
        const createTransaction = await web3.eth.accounts.signTransaction(
            {
                from: process.env.ADDRESS_WEB3,
                data: incrementerTx.encodeABI(),
                gas: '3000000',
            },
            process.env.PRIVATE_KEY_WEB3
        );
        const createReceipt = await web3.eth.sendSignedTransaction(
            createTransaction.rawTransaction
        );
        console.log(createReceipt);
        returnData = { "data": createReceipt, "error": null };
    } catch (ex) {

        returnData = { "data": null, "error": ex };

    } finally {
        return returnData;
    }
};
const addBillingDetails = async (data, billingDtl) => {

    let billingDtls = {
        walletAddress: data.walletAddress,
        legalName: data.legalName,
        emailid: data.emailid,
        billingAddress: data.billingAddress,
        zipCode: data.zipCode,
        city: data.city,
        state: data.state,
        country: data.countryName,
        taxId: data.taxId,
        taxRegNumber: data.taxRegNumber,
        userId: billingDtl.userId,
        tokenId: billingDtl.tokenId,
        createdBy: billingDtl.createdBy,
        createdOn: new Date(),
        contractAddress: billingDtl.contractAddress
    };
    var collection = database.collection(
        process.env.BILLING_DETAILS
    );

    try {
        collection.insertOne(billingDtls, async (error, result) => {
            if (error) {
                return ({ status: 2, msg: error });
            } else {
                return (result);
            }

        });
    } catch (ex) {
        return ({ status: 1, msg: "Token Created" });
    }


}
module.exports = router;