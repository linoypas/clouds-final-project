import express from "express";
const router = express.Router();
import postsController from "../controllers/posts";
import authMiddleware from "../common/auth_middleware";
import uploadMiddleware from "../common/upload_middleware";
import multer from "multer";
import path from "path";


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
router.get('/getAi', postsController.getAi.bind(postsController));

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
router.get("/", (req, res) => postsController.getAll(req, res));

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
router.get("/:id" ,postsController.getById.bind(postsController));

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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(process.cwd(), 'public/uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  router.post(
    "/",
    authMiddleware, // Authorization middleware
    upload.single("image"), // Middleware to handle image file upload
    postsController.create.bind(postsController) // Controller to handle the creation logic
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
router.delete("/:id", authMiddleware, postsController.deleteItem.bind(postsController));

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

router.put("/:id",authMiddleware,upload.single("image"), postsController.update.bind(postsController));

export default router;