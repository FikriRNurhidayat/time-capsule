const Controller = require("./Controller");

class TimeCapsuleController extends Controller {
  constructor({
    createTimeCapsuleService,
    getTimeCapsuleService,
    listTimeCapsulesService,
    paginationManager,
  }) {
    super({ paginationManager });

    this.createTimeCapsuleService = createTimeCapsuleService;
    this.listTimeCapsulesService = listTimeCapsulesService;
    this.getTimeCapsuleService = getTimeCapsuleService;
  }

  /**
   * @openapi
   * /v1/time-capsules:
   *    post:
   *        summary: Create Time Capsule
   *        description: |
   *          Add new time capsules to our service.
   *          If you want to add attachment, please upload it via [UploadFile](#/File/UploadFile)
   *        tags:
   *        - Time Capsule
   *        operationId: CreateTimeCapsule
   *        security:
   *        - BearerAuth: []
   *        requestBody:
   *            description: Create Time Capsule Payload
   *            required: true
   *            content:
   *                application/json:
   *                    schema:
   *                        title: CreateTimeCapsuleRequest
   *                        type: object
   *                        required:
   *                        - subject
   *                        - message
   *                        - releasedAt
   *                        properties:
   *                            subject:
   *                                type: string
   *                                minLength: 1
   *                                maxLength: 255
   *                                example: "Remember the day when you're in love?"
   *                            message:
   *                                type: string
   *                                minLength: 1
   *                                example: "Yeah, you must remember it."
   *                            attachmentUrl:
   *                                type: string
   *                                format: uri
   *                                example: "https://localhost:8000/uploads/industrial-society-and-its-future.pdf"
   *                            releasedAt:
   *                                type: string
   *                                format: date-time
   *        responses:
   *            400:
   *                description: Create time capsule request is not satisfiable.
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 400
   *                            reason: BAD_REQUEST
   *                            message: Request parameter is not valid. Please pass valid request parameter based on the API Contract.
   *            422:
   *                description: Time capsule creations failed to due business constraint.
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        examples:
   *                          TIME_CAPSULE_RELEASE_TIME_INVALID:
   *                            value:
   *                              error:
   *                                code: 422
   *                                reason: TIME_CAPSULE_RELEASE_TIME_INVALID
   *                                message: Release time must be on the future. Please pass valid release time.
   *                          TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS:
   *                            value:
   *                              error:
   *                                code: 422
   *                                reason: TIME_CAPSULE_ATTACHMENT_FILE_NOT_EXISTS
   *                                message: Attachment file does not exists. Please pass attachment file that exists.
   *            201:
   *                description: Time Capsule sucessfully created!
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: CreateTimeCapsuleResponse
   *                            type: object
   *                            properties:
   *                                timeCapsule:
   *                                    type: object
   *                                    properties:
   *                                        id:
   *                                            type: string
   *                                            format: uuid
   *                                            example: 1b2ea0b0-0f96-4634-91a7-28ad7942251d
   *                                        subject:
   *                                            type: string
   *                                            example: "Remember the day when you're in love?"
   *                                        active:
   *                                            type: boolean
   *                                            example: false
   *                                        releasedAt:
   *                                            type: string
   *                                            format: date-time
   *                                        createdAt:
   *                                            type: string
   *                                            format: date-time
   *                                        updatedAt:
   *                                            type: string
   *                                            format: date-time
   * */
  createTimeCapsule = (req, res, next) =>
    this.createTimeCapsuleService
      .call({
        subject: req.body.subject,
        message: req.body.message,
        attachmentUrl: req.body.attachmentUrl,
        userId: req.userId,
        releasedAt: new Date(req.body.releasedAt),
      })
      .then((timeCapsule) => {
        const body = this.buildReply({ timeCapsule });
        res.status(201).json(body);
      })
      .catch(next);

  /**
   * @openapi
   * /v1/time-capsules:
   *    get:
   *        summary: List Time Capsules
   *        description: |
   *          Retrieve current user's list of time capsules.
   *          You can specify the page number, or page size.
   *          Also you can filter it based on the parameters below.
   *          You can also sort the list based on the JSON:API Specs.
   *        tags:
   *        - Time Capsule
   *        operationId: ListTimeCapsules
   *        security:
   *        - BearerAuth: []
   *        parameters:
   *        - in: query
   *          name: sort
   *          description: |
   *            Sorting parameter to sort the list. It uses the sort format from [JSON:API specs](https://jsonapi.org/format/#fetching-sorting).
   *            Allowed sort parameters:
   *            - `subject`
   *            - `active`
   *            - `createdAt`
   *            - `updatedAt`
   *            - `releasedAt`
   *
   *            Example:
   *
   *            ```
   *            releasedAt,-createdAt
   *            ```
   *          schema:
   *            type: string
   *        - in: query
   *          name: pageNumber
   *          schema:
   *            type: integer
   *        - in: query
   *          name: pageSize
   *          schema:
   *            type: integer
   *        - in: query
   *          name: active
   *          schema:
   *            type: boolean
   *        responses:
   *            400:
   *                description: List time capsules request is not satisifiable.
   *                content:
   *                  application/json:
   *                    schema:
   *                      $ref: '#/components/schemas/Error'
   *                    examples:
   *                      BAD_REQUEST:
   *                        value:
   *                          error:
   *                            code: 400
   *                            reason: BAD_REQUEST
   *                            message: Request parameter is not valid. Please pass valid request parameter based on the API Contract.
   *                      OUT_OF_RANGE:
   *                        value:
   *                          error:
   *                            code: 400
   *                            reason: OUT_OF_RANGE
   *                            message: Page number is out of range. Please pass valid page number.
   *            200:
   *                description: Time Capsule sucessfully listed!
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: ListTimeCapsuleResponse
   *                            type: object
   *                            properties:
   *                                meta:
   *                                    type: object
   *                                    properties:
   *                                      pageNumber:
   *                                        type: integer
   *                                        example: 1
   *                                      pageSize:
   *                                        type: integer
   *                                        example: 10
   *                                      pageCount:
   *                                        type: integer
   *                                        example: 10
   *                                      size:
   *                                        type: integer
   *                                        example: 100
   *                                timeCapsules:
   *                                    type: array
   *                                    items:
   *                                      type: object
   *                                      properties:
   *                                          id:
   *                                              type: string
   *                                              format: uuid
   *                                              example: 1b2ea0b0-0f96-4634-91a7-28ad7942251d
   *                                          subject:
   *                                              type: string
   *                                              example: "Remember the day when you're in love?"
   *                                          active:
   *                                              type: boolean
   *                                              example: false
   *                                          releasedAt:
   *                                              type: string
   *                                              format: date-time
   *                                          createdAt:
   *                                              type: string
   *                                              format: date-time
   *                                          updatedAt:
   *                                              type: string
   *                                              format: date-time
   * */
  listTimeCapsules = (req, res, next) => {
    const { pageNumber, pageSize } =
      this.paginationManager.createPaginationObject(req.query);

    this.listTimeCapsulesService
      .call({
        ...this.paginationManager.convertToOffsetBased({
          pageNumber,
          pageSize,
        }),
        sort: req.query.sort,
        active: req.query.active,
        userId: req.userId,
      })
      .then(({ timeCapsules, timeCapsuleSize }) => {
        const meta = this.paginationManager.createMetaPaginationObject({
          pageNumber,
          pageSize,
          size: timeCapsuleSize,
        });
        const body = this.buildReply({ timeCapsules }, meta);
        res.status(200).json(body);
      })
      .catch(next);
  };

  /**
   * @openapi
   * /v1/time-capsules/{id}:
   *    get:
   *        summary: Get Time Capsule
   *        description: Retrieve active time capsule and read the message
   *        tags:
   *        - Time Capsule
   *        operationId: GetTimeCapsule
   *        security:
   *        - BearerAuth: []
   *        parameters:
   *        - in: path
   *          name: id
   *          schema:
   *            type: string
   *            format: uuid
   *        responses:
   *            400:
   *                description: Get time capsule request is not satisfiable.
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 400
   *                            reason: BAD_REQUEST
   *                            message: Request parameter is not valid. Please pass valid request parameter based on the API Contract.
   *            403:
   *                description: Time capsule is not owned by current user
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 403
   *                            reason: TIME_CAPSULE_MISMATCH_OWNER
   *                            message: Time capsule is not owned by you. Please find your own time capsule.
   *            404:
   *                description: Time capsule is not found
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 404
   *                            reason: TIME_CAPSULE_NOT_FOUND
   *                            message: Time capsule is not found. Please find existing time capsule.
   *            422:
   *                description: Time capsule is not activated yet
   *                content:
   *                    application/json:
   *                        schema:
   *                          $ref: "#/components/schemas/Error"
   *                        example:
   *                          error:
   *                            code: 422
   *                            reason: TIME_CAPSULE_INACTIVE
   *                            message: Cannot open time capsule before its release time. Please wait until it is released.
   *            200:
   *                description: Time Capsule sucessfully created!
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: CreateTimeCapsuleResponse
   *                            type: object
   *                            properties:
   *                                timeCapsule:
   *                                    type: object
   *                                    properties:
   *                                        id:
   *                                            type: string
   *                                            format: uuid
   *                                            example: 1b2ea0b0-0f96-4634-91a7-28ad7942251d
   *                                        subject:
   *                                            type: string
   *                                            example: "Remember the day when you're in love?"
   *                                        message:
   *                                            type: string
   *                                            example: Yeah, you must remember it.
   *                                        active:
   *                                            type: boolean
   *                                            example: true
   *                                        releasedAt:
   *                                            type: string
   *                                            format: date-time
   *                                        createdAt:
   *                                            type: string
   *                                            format: date-time
   *                                        updatedAt:
   *                                            type: string
   *                                            format: date-time
   * */
  getTimeCapsule = (req, res, next) =>
    this.getTimeCapsuleService
      .call({
        id: req.params.id,
        userId: req.userId,
      })
      .then((timeCapsule) => {
        const body = this.buildReply({ timeCapsule });
        res.status(200).json(body);
      })
      .catch(next);
}

module.exports = TimeCapsuleController;
