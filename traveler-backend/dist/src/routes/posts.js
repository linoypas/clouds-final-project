"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_1 = __importDefault(require("../controllers/posts"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts managing API
*/
/**
 * @swagger
 * /posts/getAi:
 *   delete:
 *     summary: Generate post by OpenAi
 *     description: generats a post by OpenAi
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prompt
 *         required: true
 *         schema:
 *           type: string
 *         description: The prompt for the post
 *     responses:
 *       '200':
 *         description: Post created successfully
 *       '500':
 *         description: Internal server error
 */
router.get('/getAi', posts_1.default.getAi.bind(posts_1.default));
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f53112336168a109c2
 *         title:
 *           type: string
 *           example: The Best Post
 *         content:
 *           type: string
 *           example: Bla bla bla
 *         author:
 *           type: string
 *           example: 60d0fe4f531123f168a109c3
 */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves a list of all posts
 *     tags:
 *       - Posts
 *     responses:
 *       '200':
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '500':
 *         description: Internal server error
 */
router.get("/", (req, res) => posts_1.default.getAll(req, res));
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieves a post by its ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       '200':
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id", posts_1.default.getById.bind(posts_1.default));
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       '201':
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.resolve(process.cwd(), 'public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/", auth_middleware_1.default, // Authorization middleware
upload.single("image"), // Middleware to handle image file upload
posts_1.default.create.bind(posts_1.default) // Controller to handle the creation logic
);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Deletes a post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", auth_middleware_1.default, posts_1.default.deleteItem.bind(posts_1.default));
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: update post by ID
 *     description: Updates a post by its ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", auth_middleware_1.default, upload.single("image"), posts_1.default.update.bind(posts_1.default));
exports.default = router;
//# sourceMappingURL=posts.js.map