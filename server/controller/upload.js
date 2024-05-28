const SwaggerParser = require("swagger-parser");
const util = require("util");

function extractProperties(schema) {
  const result = {};
  if (schema.properties) {
    for (const propName in schema.properties) {
      const prop = schema.properties[propName];
      if (prop.type === "array") {
        result[propName] = [extractProperties(prop.items)];
      } else if (prop.type === "object") {
        result[propName] = extractProperties(prop);
      } else {
        result[propName] = "";
      }
    }
  }
  return result;
}

function extractResponse(response) {
  const result = {
    contentType: "",
    content: [],
  };

  console.log(response)
  for (const statusCode in response) {
    const content = response[statusCode].content;
    if(content == null)
    return result

    const contentType = Object.keys(content)[0];
    const schema = content[contentType].schema;

    if(schema == null)
      return result
    console.log(schema)

    const extractedData = extractProperties(schema);
    result.contentType = contentType;
    result.content.push({
      ...extractedData,
      code: statusCode,
    });
  }
  return result;
}

// upload and parse file
exports.upload = (req, res, next) => {
  try {
    console.log(req.file);
    SwaggerParser.parse(req.file.path)
      .then((api) => {
        const swagger = [];
        for (const path in api.paths) {
          const methods = api.paths[path];
          // 遍历所有请求方法
          for (const method in methods) {
            const operation = methods[method];
            // 提取接口信息
            const name = operation.summary;
            const description = operation.description;
            let tag = "";
            if (operation.tags && operation.tags.length > 0) {
              tag = operation.tags[0];
            }
            const requestMethod = method.toUpperCase();
            const requestPath = path;
            console.log(operation)
            console.log(operation.parameters)

            if (operation.parameters === null)
              console.log("continue****************")
              continue
            const requestHeaders = operation.parameters
              .filter((param) => param.in === "header")
              .map(({ name, description, required, example, schema }) => ({
                name,
                description,
                required,
                example,
                type: schema.type,
              }));

            const requestParams = operation.parameters
              .map(
                ({
                  name,
                  in: paramIn,
                  description,
                  required,
                  example,
                  schema,
                }) => ({
                  name,
                  in: paramIn,
                  description,
                  required,
                  example,
                  type: schema.type,
                })
              )
              .reduce(
                (result, param) => {
                  if (param.in === "query") {
                    // 去除param中的in属性
                    delete param.in;
                    result.query.push(param);
                  } else if (param.in === "path") {
                    delete param.in;
                    result.path.push(param);
                  }
                  return result;
                },
                { path: [], query: [] }
              );

            let requestBody = { contentType: "", content: [] };
            if (operation.requestBody && operation.requestBody.content) {
              const contentType = Object.keys(operation.requestBody.content)[0];
              const schema = operation.requestBody.content[contentType].schema;
              if (contentType === "application/json") {
                requestBody.contentType = contentType;
                requestBody.content.push(extractProperties(schema));
              }
              else if (
                contentType === "multipart/form-data" ||
                contentType === "application/x-www-form-urlencoded"
              ) {
                requestBody = {
                  contentType: contentType.split("/")[1],
                  content: Object.entries(
                    operation.requestBody.content[contentType].schema.properties
                  ).map(([name, prop]) => ({
                    name,
                    description: prop.description || "",
                    required:
                      operation.requestBody.content[
                        contentType
                      ].schema.required.includes(name),
                    example: prop.example || "",
                    type: prop.type,
                  })),
                };
              }
              else if (contentType === "text/plain") {
                requestBody.contentType = contentType;
                requestBody.content.push({
                  name: "",
                  description: "",
                  required: false,
                  example:
                    operation.requestBody.content["text/plain"].example || "",
                  type: "string",
                });
              }
            }
            const response = extractResponse(operation.responses);
            swagger.push({
              name,
              description,
              tag,
              requestMethod,
              requestPath,
              requestHeaders,
              requestParams,
              requestBody,
              response,
            });
          }
        }
        //console.log(util.inspect(swagger, false, null, true));
        res.status(200).json({
          msg: "解析文件成功!",
          code: 200,
          data: swagger,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(400).json({
          msg: "解析文件失败!",
          code: 400,
        });
      });
  } catch (err) {
    next(err);
  }
};
