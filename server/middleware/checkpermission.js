const { UserProject } = require("../model/user-project");
const { Interface } = require("../model/interface");

module.exports = (type) => {
  return async (req, res, next) => {
    // 从req.body或者req.params中获取projectId
    let projectId = req.body.projectId || req.params.projectId;
    let interfaceId = req.params.interfaceId;
    // 如果有interfaceId，根据interfaceId的projectId进行判断
    try {
      if (interfaceId) {
        const interfaceTarget = await Interface.findById(interfaceId).select(
          "projectId"
        );
        if (!interfaceTarget) {
          return res.status(400).json({
            msg: "接口不存在",
            code: 400,
          });
        }
        projectId = interfaceTarget.projectId._id;
      }
    } catch (err) {
      next(err);
    }
    console.log(projectId);
    const userId = req.userData._id;
    UserProject.findOne({ projectId, userId })
      .then((userProject) => {
        if (userProject && userProject.auth === "admin" && type === "project") {
          next();
        } else if (
          userProject &&
          (userProject.auth === "write" || userProject.auth === "admin") &&
          type === "interface"
        ) {
          next();
        } else {
          res.status(403).json({
            msg: "权限不足",
            code: 403,
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};
