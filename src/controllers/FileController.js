const Controller = require("./Controller");

class FileController extends Controller {
  constructor({ uploadFileService }) {
    super();
    this.uploadFileService = uploadFileService;
  }
  /**
   * @openapi
   * /v1/files:
   *    post:
   *        summary: Upload File
   *        description: |
   *            Upload file to our back-end.
   *            You will receive a URL if it's successful.
   *
   *            File **MUST** be less than 1MB. We couldn't afford to pay more storage right now.
   *        tags:
   *        - File
   *        operationId: UploadFile
   *        security:
   *        - BearerAuth: []
   *        requestBody:
   *            description: Upload file payload
   *            required: true
   *            content:
   *                multipart/form-data:
   *                    schema:
   *                        title: UploadFileRequest
   *                        type: object
   *                        properties:
   *                            file:
   *                                type: string
   *                                format: binary
   *        responses:
   *            201:
   *                description: Upload file succesful.
   *                content:
   *                    application/json:
   *                        schema:
   *                            title: UploadFileResponse
   *                            type: object
   *                            properties:
   *                                file:
   *                                    type: object
   *                                    properties:
   *                                        id:
   *                                            type: string
   *                                            format: uuid
   *                                            example: 1b2ea0b0-0f96-4634-91a7-28ad7942251d
   *                                        name:
   *                                            type: string
   *                                            example: 1b2ea0b0-0f96-4634-91a7-28ad7942251d-industrial-society-and-its-future.pdf
   *                                        url:
   *                                            type: string
   *                                            example: /uploads/1b2ea0b0-0f96-4634-91a7-28ad7942251d-industrial-society-and-its-future.pdf
   *                                        createdAt:
   *                                            type: string
   *                                            format: date-time
   * */
  uploadFile = (req, res, next) =>
    this.uploadFileService
      .call({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
      })
      .then(({ file }) => {
        const body = this.buildReply({ file });
        res.status(200).json(body);
      })
      .catch(next);
}

module.exports = FileController;
