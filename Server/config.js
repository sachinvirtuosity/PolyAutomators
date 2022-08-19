const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const CONN_STRING = process.env.CONN_STRING;

module.exports = {
    //mongodburi: 'mongodb+srv://' + DB_USERNAME + ':' + DB_PASSWORD + CONN_STRING
  //  mongodburi: 'mongodb+srv://blockchain:hsan6UaFPfwwgDJ2@cluster0.2td1g.mongodb.net/blockchain_db?retryWrites=true&w=majority'
  mongodburi:"mongodb+srv://blockchain:hsan6UaFPfwwgDJ2@blockchaincluster.2td1g.mongodb.net/blockchain_db?retryWrites=true&w=majority"

}


