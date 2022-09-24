const {
  useValidation,
  useAuthorization,
  useFormData,
} = require("./middlewares");
const { typeIs } = require("./lib");
const { TYPE_FUNCTION } = require("./consts");
const POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete";

module.exports = function configureRoute(server) {
  const routes = [
    {
      method: POST,
      path: "/v1/login",
      useValidation: true,
      handler: server.authController.login,
    },
    {
      method: POST,
      path: "/v1/register",
      useValidation: true,
      handler: server.authController.register,
    },
    {
      method: POST,
      path: "/v1/resend-email-verification",
      useAuthorization: true,
      handler: server.authController.resendEmailVerification,
    },
    {
      method: GET,
      path: "/v1/users/:id/verify",
      handler: server.authController.verifyUser,
    },
    {
      method: POST,
      path: "/v1/time-capsules",
      useValidation: true,
      useAuthorization: true,
      handler: server.timeCapsuleController.createTimeCapsule,
    },
    {
      method: GET,
      path: "/v1/time-capsules",
      useAuthorization: true,
      handler: server.timeCapsuleController.listTimeCapsules,
    },
    {
      method: GET,
      path: "/v1/time-capsules/:id",
      useValidation: true,
      useAuthorization: true,
      handler: server.timeCapsuleController.getTimeCapsule,
    },
    {
      method: POST,
      path: "/v1/files",
      useAuthorization: true,
      useValidation: true,
      useFormData: (upload) => upload.single("file"),
      handler: server.fileController.uploadFile,
    },
  ];

  // Apply routes to router
  applyRoutes(server, routes);
  server.use(server.controller.onLost);
  server.use(server.controller.onError);

  return server;
};

function applyRoutes(router, routes) {
  routes.forEach((route) => {
    const routerOpts = [];

    // Push path
    routerOpts.push(route.path);

    // Push validation
    if (route.useValidation)
      routerOpts.push(useValidation(route.method, route.path));

    if (route.useAuthorization)
      routerOpts.push(useAuthorization({ tokenManager: router.tokenManager }));

    if (typeIs(route.useFormData, TYPE_FUNCTION))
      routerOpts.push(useFormData(route.useFormData));

    // Push handler
    routerOpts.push(route.handler);
    router[route.method](...routerOpts);
  });
}
