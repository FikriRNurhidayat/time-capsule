const Controller = require("./Controller");

class AuthController extends Controller {
  constructor({
    loginService,
    registerService,
    verifyUserService,
    initiateUserEmailVerificationService,
  }) {
    super();

    this.loginService = loginService;
    this.registerService = registerService;
    this.verifyUserService = verifyUserService;
    this.initiateUserEmailVerificationService =
      initiateUserEmailVerificationService;
  }

  /**
   * @openapi
   * /v1/login:
   *    post:
   *        summary: Login
   *        description: Retrieve access token by sending existing credentials
   *        operationId: login
   *        tags:
   *        - Authentication
   *        requestBody:
   *            description: Login request payload
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        title: LoginRequest
   *                        type: object
   *                        required:
   *                        - email
   *                        - password
   *                        properties:
   *                            email:
   *                                type: string
   *                                format: email
   *                                example: "fikrirnurhidayat@gmail.com"
   *                            password:
   *                                type: string
   *                                minLength: 6
   *                                maxLength: 255
   *                                example: "123456"
   *        responses:
   *            404:
   *                description: Account does not exist.
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 404
   *                            reason: EMAIL_NOT_FOUND
   *                            message: Email not found. Please pass email that exists.
   *            401:
   *                description: Password is not valid
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 401
   *                            reason: WRONG_PASSWORD
   *                            message: Wrong password. Please pass valid password.
   *            201:
   *                description: Succesful Login
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: LoginResponse
   *                            type: object
   *                            properties:
   *                                data:
   *                                    type: object
   *                                    properties:
   *                                        accessToken:
   *                                            type: string
   *                                            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4ODNjOGE2LTE1ODEtNDE4MS1hYmM1LWI2ODVkMjg4YjdhMiIsImlhdCI6MTY2MzcwMzg4NiwiZXhwIjoxNjYzNzA0NDg2fQ.ER-yzeQ6cLh-k7XVxj6GsEPDtJYDTm5ZYUMk9Xdx3cQ
   *                                        refreshToken:
   *                                            type: string
   *                                            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNkltTTRPRE5qT0dFMkxURTFPREV0TkRFNE1TMWhZbU0xTFdJMk9EVmtNamc0WWpkaE1pSXNJbWxoZENJNk1UWTJNemN3TXpnNE5pd2laWGh3SWpveE5qWXpOekEwTkRnMmZRLkVSLXl6ZVE2Y0xoLWs3WFZ4ajZHc0VQRHRKWURUbTVaWVVNazlYZHgzY1EiLCJpYXQiOjE2NjM3MDM4ODYsImV4cCI6MTY2Mzc5MDI4Nn0.AxNddItZzZxW960_arUPNm14qTMx0WtWdRZkyLft4HQ
   * */
  login = (req, res, next) =>
    this.loginService
      .call({
        email: req.body.email,
        password: req.body.password,
      })
      .then((token) => {
        const responseBody = this.buildReply(token);
        res.status(201).json(responseBody);
      })
      .catch(next);

  /**
   * @openapi
   * /v1/register:
   *    post:
   *        summary: Register
   *        description: Be time capsule enjoyer.
   *        operationId: register
   *        tags:
   *        - Authentication
   *        requestBody:
   *            description: Register request payload
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        title: RegisterRequest
   *                        type: object
   *                        required:
   *                        - email
   *                        - password
   *                        properties:
   *                            email:
   *                                type: string
   *                                format: email
   *                                example: "fikrirnurhidayat@gmail.com"
   *                            password:
   *                                type: string
   *                                minLength: 6
   *                                maxLength: 255
   *                                example: "123456"
   *        responses:
   *            201:
   *                description: Succesful Registration
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: RegisterResponse
   *                            type: object
   *                            properties:
   *                                data:
   *                                    type: object
   *                                    properties:
   *                                        accessToken:
   *                                            type: string
   *                                            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4ODNjOGE2LTE1ODEtNDE4MS1hYmM1LWI2ODVkMjg4YjdhMiIsImlhdCI6MTY2MzcwMzg4NiwiZXhwIjoxNjYzNzA0NDg2fQ.ER-yzeQ6cLh-k7XVxj6GsEPDtJYDTm5ZYUMk9Xdx3cQ
   *                                        refreshToken:
   *                                            type: string
   *                                            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNkltTTRPRE5qT0dFMkxURTFPREV0TkRFNE1TMWhZbU0xTFdJMk9EVmtNamc0WWpkaE1pSXNJbWxoZENJNk1UWTJNemN3TXpnNE5pd2laWGh3SWpveE5qWXpOekEwTkRnMmZRLkVSLXl6ZVE2Y0xoLWs3WFZ4ajZHc0VQRHRKWURUbTVaWVVNazlYZHgzY1EiLCJpYXQiOjE2NjM3MDM4ODYsImV4cCI6MTY2Mzc5MDI4Nn0.AxNddItZzZxW960_arUPNm14qTMx0WtWdRZkyLft4HQ
   *            422:
   *                description: Failed registration due to business constraint
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 422
   *                            reason: EMAIL_ALREADY_TAKEN
   *                            message: Email is already taken. Please use another email.
   * */
  register = (req, res, next) =>
    this.registerService
      .call({
        email: req.body.email,
        password: req.body.password,
      })
      .then((token) => {
        const responseBody = this.buildReply(token);
        res.status(201).json(responseBody);
      })
      .catch(next);

  /**
   * @openapi
   * /v1/resend-email-verification:
   *    post:
   *        summary: Resend Email Verification
   *        description: Haven't verify your email? Try to resend the email verification.
   *        operationId: ResendEmailVerification
   *        tags:
   *        - Authentication
   *        security:
   *        - BearerAuth: []
   *        responses:
   *            202:
   *              description: Email verification sent.
   *            422:
   *                description: Email is already verified.
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 422
   *                            reason: EMAIL_ALREADY_VERIFIED
   *                            message: Email already verified.
   *
   * */
  resendEmailVerification = (req, res, next) =>
    this.initiateUserEmailVerificationService
      .call({ id: req.userId })
      .then(() => res.status(202).end())
      .catch(next);

  verifyUser = (req, res, next) =>
    this.verifyUserService
      .call({
        id: req.params.id,
        emailVerificationToken: req.query.emailVerificationToken,
      })
      .then(() => res.status(200).send("OK"))
      .catch(next);
}

module.exports = AuthController;
