// 引入jwt
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      code: 401,
      msg: "请求头中Token不存在!",
    });
  }

  try {
    const verifyData = jwt.verify(token, config.secret);
    // 如果验证成功,将用户信息挂载到req上
    req.userData = verifyData;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      msg: "Token存在，但是无效!",
    });
  }
};
