const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
//const swaggerJsdoc = require('swagger-jsdoc'); 
const port = process.env.PORT || 5000;
const login = require("./apis/login.js");
const appApi = require("./apis/appApi.js");
const adminapi=require("./apis/adminapi.js");
const swaggerDocument = require("./swaggerDocs.json");


var app = express();
// const swaggerOptions = {
//     definition: {
//       info: {
//         title: 'Blockchain Apis',
//         version: '1.0.0',
//       },
//       servers:["http://localhost:",port,"/"]
//     },
//     apis: ['./login*.js'], // files containing annotations as above
//   };

//   const swaggerDocs=swaggerJsdoc(swaggerOptions);
app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(
  session({
    secret:  process.env.SESSION_SECRIT,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24*60*60*1000 }
  })
);
app.use(cookieParser("secretcode"));
app.listen(port, async () => {  
    console.log("Listen port",port);
});

app.use('/login', login);
app.use('/api',appApi);
app.use('/admin',adminapi);


