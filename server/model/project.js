const mongoose = require("mongoose"); // 连接mongodb

// 引入Joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// 定义project结构
const interfaceStruct = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 500,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    select: false,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  interfaceCount: {
    type: Number,
    default: 0,
  },
  interfaces: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interface",
      },
    ],
    select: false,
  },
  __v: {
    type: Number,
    select: false,
  },
});


const Project = mongoose.model("Project", interfaceStruct);


function projectValidator(data) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(15).required().messages({
      "any.required": "项目名称不能为空",
      "string.min": "项目名称长度不能小于2位",
      "string.max": "项目名称长度不能大于15位",
    }),
    description: Joi.string().trim().min(2).max(500).messages({
      "string.min": "项目描述长度不能小于2位",
      "string.max": "项目描述长度不能大于500位",
    }),
    creator: Joi.objectId().messages({
      "any.required": "项目创建者不能为空",
    }),
    members: Joi.array().items(Joi.objectId().required()).messages({
      "any.required": "项目成员不能为空",
    }),
    createTime: Joi.date().default(Date.now),
  });
  return schema.validate(data);
}

// 更新校验规则
function updateProjectValidator(data) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(15).required().messages({
      "any.required": "项目名称不能为空",
      "string.min": "项目名称长度不能小于2位",
      "string.max": "项目名称长度不能大于15位",
    }),
    description: Joi.string().trim().min(2).max(200).messages({
      "string.min": "项目描述长度不能小于2位",
      "string.max": "项目描述长度不能大于200位",
    }),
  });
  return schema.validate(data);
}


module.exports = {
  Project,
  projectValidator,
  updateProjectValidator,
};
