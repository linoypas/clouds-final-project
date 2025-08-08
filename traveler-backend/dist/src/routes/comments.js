"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_1 = __importDefault(require("../controllers/comments"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments managing API
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Comments:
 *       type: object
 *       required:
 *         - comment
 *         - owner
 *         - postId
 *       properties:
 *         _id:
 *           type: string
 *           example: 67929b65e07c754b7965c9c8
 *         comment:
 *           type: string
 *           example: Bla Bla Bla
 *         owner:
 *           type: string
 *           example: Linoy
 *         postId:
 *           type: string
 *           example: 6792aaeefdce01c83651ea88
 */
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves a list of all comments
 *     tags:
 *       - Comments
 *     responses:
 *       '200':
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Internal server error
 */
router.get("/", (req, res) => comments_1.default.getAll(req, res, "postId"));
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieves a comment by its ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       '200':
 *         description: A single comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id", comments_1.default.getById.bind(comments_1.default));
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     description: Add a new comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       '201':
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Invalid input
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.post("/", auth_middleware_1.default, comments_1.default.create.bind(comments_1.default));
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Deletes a comment by its ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", comments_1.default.deleteItem.bind(comments_1.default));
exports.default = router;
//# sourceMappingURL=comments.js.map