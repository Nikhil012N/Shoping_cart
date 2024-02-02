require("dotenv").config();
const app=require("./src/app");
const mongoose = require("mongoose");
const http=require("http");
const dns = require("dns");
const port = process.env.NODE_PORT;
const server = http.createServer(app);
const database = mongoose.connection;
database.on("error", () => {
  console.error("Connection error");
});
database.once("open", () => {
  console.log("database connected ");
});
server.listen(port, () => {
  const server = dns.getServers();
  console.log(`http://${server.toString()}:${port}/api/v1`);
});
