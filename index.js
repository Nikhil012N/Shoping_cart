require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const dns = require("dns");
const app = express();
const cors = require("cors");
const logger=require("morgan");
const port = process.env.NODE_PORT;
const mongoConnection = require("./mongoconnect");
const routes = require("./src/routes/routes");
const { jwtProtected } = require("./src/middlewares/jwtAuth");
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
app.use(logger("combined"));
mongoConnection();
const database = mongoose.connection;
database.on("error", () => {
  console.error("Connection error");
});

database.once("open", () => {
  console.log("database connected ");
});


app.use("/api/v1",jwtProtected,routes);
app.all("*", (req, res) => {
  res
    .status(404)
    .send('404! Path does not exist');
});
app.listen(port, () => {
  const server = dns.getServers();
  console.log(`http://${server.toString()}:${port}/api/v1`);
});
