module.exports = (err, req, res, next) => {
  res.status(500).json({
    msg: "服务器错误!",
    code: 500,
  });

  console.error(err);
};
