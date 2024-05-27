module.exports = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator(req.body);
    if (error) {
      return res.status(400).json({
        value: error._original,
        code: 400,
        msg: error.details[0].message,
      });
    }
    req.validValue = value;
    next();
  };
};
