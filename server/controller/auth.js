const { User } = require("../model/user");

const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
  try {
    // 获取到校验后的数据
    const value = req.validValue;

    let user = await User.findOne({ email: value.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).json({
        code: 400,
        msg: "用户名或密码错误!",
      });
    }

    const Valid = await bcrypt.compare(value.password, user.password);

    if (!Valid) {
      return res.status(400).json({
        msg: "用户名或密码错误!",
        code: 400,
      });
    }
    // 5.如果密码正确，返回登录成功
    res.status(200).json({
      msg: "登录成功!",
      code: 200,
      data: {
        id: user._id,
        name: user.name,
        token: user.generateToken(),
      },
    });
  } catch (err) {
    next(err);
  }
};
