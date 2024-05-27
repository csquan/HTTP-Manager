const config = require("./config");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();


app.use(express.json());

app.use(cors());

app.use(morgan("dev"));


app.use(express.static("public"));


require("./model");


app.use("/api", require("./routes"));
app.use("/mock", require("./routes/mock"));

// 处理错误的中间件,必须放在路由后面
app.use(require("./middleware/error"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Got a POST request");
});

app.listen(config.app.port, () => {
  console.log(`Running at http://localhost:${config.app.port}`);
});
