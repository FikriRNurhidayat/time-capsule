const config = require("./config");
const {
  Controller,
  AuthController,
  FileController,
  TimeCapsuleController,
} = require("./controllers");
const {
  PaginationManager,
  PasswordManager,
  TokenManager,
} = require("./managers");
const {
  FileRepository,
  TimeCapsuleRepository,
  UserRepository,
} = require("./repositories");
const { EmailVerificationMailer } = require("./mailers");
const {
  CreateTimeCapsuleService,
  ListTimeCapsulesService,
  GetTimeCapsuleService,
  InitiateUserEmailVerificationService,
  LoginService,
  UploadFileService,
  RegisterService,
  VerifyUserService,
} = require("./services");
const { LocalUploader } = require("./uploaders");

module.exports = function injectDependency(server) {
  // Common Managers
  // Instantiate PasswordManager
  server.passwordManager = new PasswordManager({ salt: 10 });

  // Instantiate TokenManager
  server.tokenManager = new TokenManager({
    accessTokenSecretKey: config.ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecretKey: config.REFRESH_TOKEN_SECRET_KEY,
    refreshTokenExpiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
  });

  server.paginationManager = new PaginationManager({
    defaultPageSize: 10,
  });

  // Common Mailers
  server.emailVerificationMailer = new EmailVerificationMailer();

  // Common Controllers
  server.controller = new Controller();

  // Common Repositories
  server.userRepository = new UserRepository();

  // Common Services
  server.initiateUserEmailVerificationService =
    new InitiateUserEmailVerificationService({
      userRepository: server.userRepository,
      passwordManager: server.passwordManager,
      emailVerificationMailer: server.emailVerificationMailer,
    });

  // Authentication Domain
  // Instantiate LoginService
  server.loginService = new LoginService({
    passwordManager: server.passwordManager,
    tokenManager: server.tokenManager,
    userRepository: server.userRepository,
  });

  // Instantiate RegisterService
  server.registerService = new RegisterService({
    passwordManager: server.passwordManager,
    tokenManager: server.tokenManager,
    userRepository: server.userRepository,
    initiateUserEmailVerificationService:
      server.initiateUserEmailVerificationService,
  });

  server.verifyUserService = new VerifyUserService({
    passwordManager: server.passwordManager,
    userRepository: server.userRepository,
  });

  // Instantiate AuthController
  server.authController = new AuthController({
    loginService: server.loginService,
    registerService: server.registerService,
    verifyUserService: server.verifyUserService,
    initiateUserEmailVerificationService:
      server.initiateUserEmailVerificationService,
  });

  // Time Capsule Domain
  // Instantiate TimeCapsuleRepository
  server.timeCapsuleRepository = new TimeCapsuleRepository();

  // Instantiate CreateTimeCapsuleService
  server.createTimeCapsuleService = new CreateTimeCapsuleService({
    timeCapsuleRepository: server.timeCapsuleRepository,
  });

  // Instantiate ListTimeCapsulesService
  server.listTimeCapsulesService = new ListTimeCapsulesService({
    timeCapsuleRepository: server.timeCapsuleRepository,
  });

  // Instantiate GetTimeCapsuleService
  server.getTimeCapsuleService = new GetTimeCapsuleService({
    timeCapsuleRepository: server.timeCapsuleRepository,
  });

  // Instantiate TimeCapsuleController
  server.timeCapsuleController = new TimeCapsuleController({
    paginationManager: server.paginationManager,
    createTimeCapsuleService: server.createTimeCapsuleService,
    listTimeCapsulesService: server.listTimeCapsulesService,
    getTimeCapsuleService: server.getTimeCapsuleService,
  });

  // File Domain
  // Instantiate LocalUploader
  server.localUploader = new LocalUploader();

  // Instantiate FileRepository
  server.fileRepository = new FileRepository();

  // Instantiate UploadFileService
  server.uploadFileService = new UploadFileService({
    uploader: server.localUploader,
    fileRepository: server.fileRepository,
  });

  // Instantiate FileController
  server.fileController = new FileController({
    uploadFileService: server.uploadFileService,
  });

  return server;
};
