const Validator = require("ajv");
const addFormats = require("ajv-formats");
const errors = require("../errors");
const docs = require("../docs");

function normalizeSchema(schema) {
  delete schema.example;

  if (schema.type === "object") {
    Object.keys(schema.properties).forEach((key) => {
      normalizeSchema(schema.properties[key]);
    });
  }

  return schema;
}

function normalizePath(path) {
  let shouldCloseCurlyBraces = false;
  let pathSize = path.length;

  return path
    .split("")
    .map((char, index) => {
      if (char != ":") {
        if (shouldCloseCurlyBraces && char == "/") return "}/";
        if (shouldCloseCurlyBraces && index == path.length - 1)
          return `${char}}`;

        return char;
      }

      shouldCloseCurlyBraces = true;

      return "{";
    })
    .join("");
}

module.exports = function useValidation(method, path) {
  path = normalizePath(path);
  const operation = docs.paths[path][method];
  const content = operation?.requestBody?.content;
  if (!content)
    return function validateRequest(req, res, next) {
      next();
    };
  let schema = { ...operation.requestBody.content["application/json"]?.schema };

  if (!!operation.parameters)
    operation.parameters.forEach((params) => {
      schema.properties[params.name] = params.schema;
      if (params.required) schema.required.push(params.name);
    });

  const validator = addFormats(new Validator());
  const validate = validator.compile(normalizeSchema({ ...schema }));

  return function validateRequest(req, res, next) {
    const payload = {
      ...req.body,
      ...req.query,
      ...req.params,
    };

    const validationResult = validate(payload);
    if (validationResult === true) {
      next();
      return;
    }

    const error = errors.BAD_REQUEST.withDetails(validate.errors);
    res.status(error.code).json(error.toJSON());
  };
};
