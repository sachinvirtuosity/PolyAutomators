const mongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const config = require("../config.js");
const MONGODB_URI = config.mongodburi;
class connection{
    constructor(){};
    async connectdb(){
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
                let database=  client.db(process.env.DATABASE);
                return database;
            }
        );
    }
}
module.exports =connection;