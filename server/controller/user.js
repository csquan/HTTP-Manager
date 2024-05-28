// 引入bcrypt
const bcrypt = require("bcrypt");

const { User } = require("../model/user");

// 注册
exports.register = async (req, res, next) => {
  try {
    let { email, password, name } = req.validValue;
    // 1. 判断邮箱是否已经被注册
    let user = await User.findOne({ email });
    // 2. 如果邮箱已经被注册，返回错误信息
    if (user) {
      return res.status(400).json({
        msg: "邮箱已经被注册!",
        code: 400,
        data: { email },
      });
    }
    // 3. 注册新用户
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({
      email,
      password,
      name,
    });

    await user.save();

    res.status(200).json({
      code: 200,
      msg: "注册成功!",
      data: { email, name, _id: user._id },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    let paramId = req.params.id;
    let userTarget = await User.findById(paramId);
    if (!userTarget) {
      return res.status(400).json({
        code: 400,
        msg: "用户不存在!",
      });
    }
    res.status(200).json({
      code: 200,
      msg: "查询用户成功!",
      data: userTarget,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    let body = req.body;
    let paramId = req.params.id;

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    const dataTarget = await User.findByIdAndUpdate(paramId, body);

    if (!dataTarget) {
      return res.status(400).json({
        msg: "用户不存在!",
        code: 400,
      });
    }

    res.status(200).json({
      msg: "修改用户成功!",
      code: 200,
      data: req.body,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let paramId = req.params.id;

    if (!paramId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        msg: "用户 id 不符合格式!",
        code: 400,
        value: {
          _id: paramId,
        },
      });
    }

    const user = await User.findByIdAndDelete(paramId);

    if (!user) {
      return res.status(400).json({
        msg: "用户不存在!",
        code: 400,
        value: {
          _id: paramId,
        },
      });
    }

    res.status(200).json({
      msg: "删除用户成功!",
      code: 200,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
