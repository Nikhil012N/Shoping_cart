const express = require("express");
const sanitize=require("express-mongo-sanitize");
const mongoConnection=require("../mongoconnect");
const app = express();
const helmet=require("helmet");
// const xss =require("xss");
const cors = require("cors");
const logger=require("morgan");
const passport =require("passport");
const cookieParser=require("cookie-parser");
const { jwtProtected } = require("./middlewares/jwtAuth");
const authCheker = require("./middlewares/authchecker");
const router = require("./routes/routes");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(sanitize());
app.use(logger("combined"));
mongoConnection();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.options('*', cors());
app.use(passport.initialize());
app.use("/api/v1",jwtProtected,authCheker,router);
app.all("*", (req, res) => {
  res
    .status(404)
    .send('404! Path does not exist');
});

module.exports=app;