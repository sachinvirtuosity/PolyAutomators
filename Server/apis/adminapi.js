const express = require("express");
const moment= require("moment");
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const dotenv = require("dotenv");
dotenv.config();
const config = require("../config.js");
const MONGODB_URI = config.mongodburi;
var jwt = require('jsonwebtoken');
var router = express.Router();
const jverify = require("../model/JWT.js");
const Enum = require("enum");
Enum.register();
const constants = require("../model/constants.js");
var database = "";
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
//Varify JWT Token
router.use('*',async (request, response, next) => {
    if (!database) {
      response.send("DB not initialized yet");
      return;
    }else{
        await jverify.validateToken(request,response).then((data)=>{
        if(!data.status || data.details == null){
          response.send({status:0,msg:"Unauthenticated request"});
               return; 
        } else {
              next()
            }
          });
    }
  })
  //API to Update TOken Status
router.post("/updateTokenStatus",(request,response)=>{
let setQuery = {
    status:  constants.tokenStatus.get(request.body.status).value,
    remarks:request.body.remark,
    updatedOn: new Date(),
    updatedBy: request.body.userName   
};
let collection = database.collection(
    process.env.TOKEN_DETAILS
);
collection.updateOne(
    {"_id":new ObjectId( request.body.id)},
    {
        $set: setQuery
    },
    
    {
        upsert: false,
    },
    (error, result) => {
        if (error) {
            console.log(error)
        }
        response.send({status:1,msg:"Token status Updated"});
    }
    );

    
});
//API to Update Sunscription Fee
router.post("/updateSubscriptionFee", (request, response) => {
            let query={
                contractType:constants.tokenTypeList.get(request.body.contract_type).value,
                network:constants.networkList.get(request.body.network).value,

            };

            let setQuery = {
                feeIn$: request.body.fees,
                contractType: constants.tokenTypeList.get(request.body.contract_type).value,
                status:  request.body.status,
                network:constants.networkList.get(request.body.network).value,
                updatedOn: new Date(),
                updatedBy: request.body.userName   
            };
            let collection = database.collection(
                process.env.SUBSCRIPTION_FEE
            );
            collection.updateOne(
                query,
                {
                  $set: setQuery,
                  $setOnInsert: {
                    createdOn: new Date(),
                    createdBy: request.body.userName  
                  }
                },
                
                {
                  upsert: true,
                },
                (error, result) => {
                  if (error) {
                      console.log(error)
                  }
                  response.send({status:1, msg:"Subscription Fee Updated"});
                }
              );
       
}); 
//API to get All User Details
router.get("/getAllUserDetails/:pg", async (req, res) => {
    var pageNumber = req.params.pg;
   
    database && database.collection(process.env.USER_DETAILS)
        .aggregate([
            {
                $addFields: {
                    country: {
                        $toObjectId: "$country"
                    }
                }
            },

            {
                $lookup: {
                    from: process.env.COUNTRY_LIST,
                    localField: "country",
                    foreignField: "_id",
                    as: "userCountry"
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { _id: -1 } },

                        { $skip: (pageNumber > 0 ? ((pageNumber - 1) * parseInt(process.env.USER_PER_PAGE)) : 0) },
                        { $limit: (parseInt(process.env.USER_PER_PAGE)) },
                        {$project:{firstName: 1,
                            lastName: 1,
                            email_id: 1,
                            userCountry: 1,
                            userName: 1,
                            isMetamask:1}}
                    ]
                        
                }
            }
        ]).toArray(async (error, result) => {
            if (error) {
                return response.send(error);
            }
            if (Object.keys(result[0].metadata).length > 0) {
            let totalcount = result[0].metadata[0].total;
            let numberOfPages = Math.ceil(parseInt(totalcount) / parseInt(process.env.USER_PER_PAGE));
            result[0].metadata[0].numberOfPages = numberOfPages;
            }
            if (Object.keys(result[0].data).length > 0) {
                result[0].data.map(data => {
                   
                    data.isMetamask=data.isMetamask==true?'Metamask':"-";


                })
            }
            res.send(result[0]);
        });

});
//API to get token detials for user
router.get("/getTokenDetailsbyUser/:userId/:pg", async (req, res) => {
    var pageNumber = parseInt(req.params.pg);
    var userId = req.params.userId;
    var query={};
    if(userId!=undefined){
        query= { _id: ObjectId(userId) };
    }
    database && database.collection(process.env.TOKEN_DETAILS)
    .aggregate([
       
      
        {
            $lookup: {
                from: process.env.USER_DETAILS,
                localField: "userName",
                foreignField: "userName",
               pipeline:[{
                   $match:{_id:ObjectId(userId)}
               }],
                as: "userToken"
            }
        },
        {$unwind:'$userToken'},
        {
            $lookup: {
                from: process.env.BILLING_DETAILS,
                localField: "_id",
                foreignField: "tokenId",
                as: "billingDetails"
            }
        },
        {$unwind:'$billingDetails'},
       
        
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $sort: { _id: -1 } },

                    { $skip: (pageNumber > 0 ? ((pageNumber - 1) * parseInt(process.env.TOKEN_PER_PAGE)) : 0) },
                    { $limit: (parseInt(process.env.TOKEN_PER_PAGE)) },
                    {$project:{"userToken":0}},
                   
                   
                ]
            }
        }

    ]).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
           
            if(Object.keys(result[0].metadata).length>0){
                let totalcount = result[0].metadata[0].total;
                let numberOfPages = Math.ceil(parseInt(totalcount) / parseInt(process.env.TOKEN_PER_PAGE));
                result[0].metadata[0].numberOfPages = numberOfPages;
            }
            if(Object.keys( result[0].data).length>0){
              
            result[0].data.map(data => {
                console.log(data);
               
                data.supplyType = constants.supplyTypeList.get(data.supplyType).key;
                data.accessType = constants.supplyTypeList.get(data.accessType).key;
                data.transferType = constants.transferTypeList.get(data.transferType).key;
                data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                data.network = constants.networkList.get(data.network).key;
                data.status = constants.tokenStatus.get(data.status).key;
                data.createdOn = moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");
                data.isMetamask=data.isMetamask?'Metamask':"-";

            })
        }
            res.send(result[0]);
        });

});
router.get("/getTokenDetails/:pg", async (req, res) => {
    var pageNumber = parseInt(req.params.pg);
    var userId = req.params.userId;
    database && database.collection(process.env.TOKEN_DETAILS)
    .aggregate([ 
        {
            $lookup: {
                from: process.env.BILLING_DETAILS,
                localField: "_id",
                foreignField: "tokenId",
                as: "billingDetails"
            }
        },
        {$facet:{
            metadata: [ { $count: "total" } ],
            data: [ 
            { $sort:{ _id: -1 }},
                            
           {  $skip: (pageNumber > 0 ? ((pageNumber - 1) * parseInt(process.env.TOKEN_PER_PAGE)) : 0)},
            { $limit:(parseInt(process.env.TOKEN_PER_PAGE)) }    ]
        }}
           
    ])
    .toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            let totalcount=result[0].metadata[0].total;
            let numberOfPages=Math.ceil(parseInt(totalcount)/parseInt(process.env.TOKEN_PER_PAGE));
            result[0].metadata[0].numberOfPages=numberOfPages;
             result[0].data.map(data => {
                data.supplyType = constants.supplyTypeList.get(data.supplyType).key;
                data.accessType = constants.supplyTypeList.get(data.accessType).key;
                data.transferType = constants.transferTypeList.get(data.transferType).key;
                data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                data.network = constants.networkList.get(data.network).key;
                data.status = constants.tokenStatus.get(data.status).key;
                data.createdOn=moment(new Date(data.createdOn)).format("DD-MM-YYYY HH:mm:ss");
                data.isMetamask=data.isMetamask?'Metamask':"-";

            })
            res.send(result[0]);
        });

});
//API to get token details by token ID
router.get("/getTokenDetailsbyId/:tokenId", async (req, res) => {   
    var tokenId = req.params.tokenId;
    database && database.collection(process.env.TOKEN_DETAILS)
       // .find({ '_id': new ObjectId(tokenId) })
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
                data.supplyType =constants.supplyTypeList.get(data.supplyType).key;
                data.accessType = constants.supplyTypeList.get(data.accessType).key;
                data.transferType = constants.transferTypeList.get(data.transferType).key;
                data.tokenType = constants.tokenTypeList.get(data.tokenType).key;
                data.network = constants.networkList.get(data.network).key;
                data.isMetamask=data.isMetamask?'Metamask':"-";

            })
            res.send(result);
        });

});
//API to get Subscription Fees List
router.get("/getSubscriptionFeeList", async (req, res) => {
    database && database.collection(process.env.SUBSCRIPTION_FEE)
        .find({}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            if(result.length>0){
            result.map(data => {
                data.contractType = constants.tokenTypeList.get(data.contractType).key;
                data.network=constants.networkList.get(data.network).key,
                data.updatedOn = moment(new Date(data.updatedOn)).format("DD-MM-YYYY HH:mm:ss");
            });
        }
            res.send(result);
        });
});  
//API to get Subscription Fees details 
router.get("/getSubscriptionFee/:id", async (req, res) => {
    const subId = req.params.id;
    database && database.collection(process.env.SUBSCRIPTION_FEE)
        .find({"_id":new ObjectId(subId)}).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            result.map(data => {
                data.contractType = constants.tokenTypeList.get(data.contractType).key;
                data.updatedOn = moment(new Date(data.updatedOn)).format("DD-MM-YYYY HH:mm:ss");
            });
            res.send(result);
        });
}); 
                                            
module.exports = router;