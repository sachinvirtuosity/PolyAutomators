const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const config = require("../config.js");
const MONGODB_URI = config.mongodburi;
var jwt = require('jsonwebtoken');
var router = express.Router();
const jverify = require("../model/JWT.js");
const bcrypt = require("bcryptjs");

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
//API to login to Admin Portal
router.post("/adminLogin", async function (request, response) {
    var resultData = [];
    var token;
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        let query = {
            'username': request.body.username
        }
        var collection = database.collection(
            process.env.ADMIN_USER
        );

        collection.findOne(query, async (error, userDtls) => {
            if (error) {
                response.send(error);
            } else {
               
                if (userDtls != null) {
                    await bcrypt.compare(request.body.password, userDtls.password, async (err, result) => {
                        if (err) throw err
                        if (result == true) {
                            var data={
                                "username":request.body.username,
                                "role":"admin",
                                "date":+ new Date()
                            }
                            token = jwt.sign({
                                data
                            }, process.env.JWT_SECRET, {
                                
                                expiresIn: process.env.EXP
                            });
                        
                            resultData={ "token": token, 
                            "id":userDtls._id,
                            "username":userDtls.username,
                           "msg": "LoggedIn successfully."};  
                            response.send(resultData);
                        } else {
                            response.send({ "token": "", "msg": "Invalid Password." });
                        }
                    });
                } else {
                    response.send({ "token": "", "msg": "Invalid User." });
                }
            }
        });

    } catch (Err) {
        console.log(Err);
        resultData = {
            
            'alertmessage': Err
        };

        response.send(resultData);
    }
});
//API to SignIN by User name and Password
router.post("/signin", async function (request, response) {
   
    var resultData = [];
    var token;
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        let query = {
            'userName': request.body.username
        }
        var collection = database.collection(
            process.env.USER_DETAILS
        );

        collection.findOne(query, async (error, userDtls) => {
            if (error) {
                response.send(error);
            } else {
                if (userDtls != null) {
                  
                    await bcrypt.compare(request.body.password, userDtls.password, async (err, result) => {
                        if (err) throw err
                        if (result == true) {
                            var data={
                                "email_id":userDtls.email_id,
                                "role":"users",
                                "userName":userDtls.userName
                            }
                      
                          
                            token = jwt.sign({
                                data
                            }, process.env.JWT_SECRET, {
                                
                                expiresIn: process.env.EXP
                            });
                            var verify = await jverify.verifyjwt(token);
                           
                            resultData={ "token": token, 
                            "id":userDtls._id,
                            "username":userDtls.userName,
                           "msg": "LoggedIn successfully."};
                           
                            response.send(resultData);
                        } else {
                            response.send({ "msg": "Invalid Password." });
                        }
                    });
                } else {
                    response.send({  "msg": "Invalid User." });
                }
            }
        });

    } catch (Err) {
        console.log(Err);
        resultData = {
            
            'alertmessage': Err
        };

        response.send(resultData);
    }
});
//API to Login user via Metamask
router.post("/userLoginViaMetamask", async function (request, response) {
  
    var resultData = [];
    var token;
    try {
      
        let query = {
            'accountId': request.body.accountId
        }
        var collection = database.collection(
            process.env.USER_DETAILS
        );

        collection.findOne(query, async (error, userDtls) => {
            if (error) {
                response.send(error);
            } else {
                if (userDtls != null) {
                    
                   
                            var data={
                                "email_id":userDtls.email_id,
                                "role":"users",
                                "userName":userDtls.userName
                            }
                           
                            token = jwt.sign({
                                data
                            }, process.env.JWT_SECRET, {
                                
                                expiresIn: process.env.EXP
                            });
                            var verify = await jverify.verifyjwt(token);
                           
                            resultData={ "token": token, 
                            "id":userDtls._id,
                            "username":userDtls.userName,
                            "isMetamask":userDtls.isMetamask,
                           "msg": "LoggedIn successfully."};
                           
                            response.send(resultData);
                        
                    
                } else {
                    let newUser = {
                        firstName: null,
                        lastName: null,
                        email_id: null,
                        country: null,
                        userName:request.body.accountId,
                        password: null,
                        status:1,
                        createdOn:new Date(),
                        role:"user",
                        accountId:request.body.accountId,
                        isMetamask:true
                    };
                    collection.insertOne(newUser, async (error, result) => {
                        if (error) {
                            return response.send(error);
                        } else {
                           
                            var data={
                                "email_id":null,
                                "role":"users",
                                "userName":request.body.accountId
                            }
                          
                            token = jwt.sign({
                                data
                            }, process.env.JWT_SECRET, {
                                
                                expiresIn: process.env.EXP
                            });
                            var verify = await jverify.verifyjwt(token);
                           
                            resultData={ "token": token, 
                            "id":result.ops[0]._id,
                            "isMetamask":result.ops[0].isMetamask,
                            "username":request.body.accountId,
                           "msg": "LoggedIn successfully."};
                           
                            response.send(resultData);
                        
                        }
        
                    });
                }
            }
        });

    } catch (Err) {
        console.log(Err);
        resultData = {
            
            'alertmessage': Err
        };

        response.send(resultData);
    }
});
//API For SignUp
router.post("/register", (request, response) => {
    let eamil_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let pwd_regex = new RegExp('(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8}');
    if(!eamil_regex.test(request.body.email_id)){
      return response.send("Invalid Email Id");
    }
    if(!pwd_regex.test(request.body.password)){
        return response.send("Password should conatain minimum 8 character with at least a symbol, upper and lower case letters and a number");
      }

    let query = { 'userName': request.body.userName }
    var collection = database.collection(
        process.env.USER_DETAILS
    );
    collection.findOne(query, async (err, result) => {
        if (err) {
            return response.send(err);
        }
        if (result != null) {
            response.send("User Already Exists");
        } else {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            let newUser = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email_id: request.body.email_id,
                country: request.body.country,
                userName:request.body.userName,
                password: hashedPassword,
                status:1,
                createdOn:new Date(),
                role:"user",
                isMetamask:false
            };
            collection.insertOne(newUser, async (error, result) => {
                if (error) {
                    return response.send(error);
                } else {
                    response.send("User Created");
                }

            });
        }
    });
});
router.post("/registerAdmin", (request, response) => {
    let eamil_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let pwd_regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8}');
    if(!eamil_regex.test(request.body.email_id)){
      return response.send("Invalid Email Id");
    }
    if(!pwd_regex.test(request.body.password)){
        return response.send("Password should conatain minimum 8 character with at least a symbol, upper and lower case letters and a number");
      }

    let query = { 'username': request.body.username }
    var collection = database.collection(
        process.env.ADMIN_USER
    );
    collection.findOne(query, async (err, result) => {
        if (err) {
            return response.send(err);
        }
        if (result != null) {
            response.send("User Already Exists");
        } else {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            let newUser = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email_id: request.body.email_id,
                country: request.body.country,
                password: hashedPassword,
                username:request.body.username,
                status:1,
                createdOn:new Date(),
                role:"admin"
            };
            collection.insertOne(newUser, async (error, result) => {
                if (error) {
                    return response.send(error);
                } else {
                    response.send("User Created");
                }

            });
        }
    });
});
router.get("/logout", (req, res) => {
    if (req) {
        req.logout();
        res
            .clearCookie("connect.sid", { path: "/" })
            
            .send("You are Logged Out Successfully");
    } else {
        res.send("Log Out Failed");
    }
});
router.get("/getCountryList", async (req, res) => {
    database && database.collection(process.env.COUNTRY_LIST)
        .find({}).sort({ countryName: 1 }).toArray(async (error, result) => {
            if (error) {
                return res.send(error);
            }
            
            res.send(result);
        });
});
module.exports = router;