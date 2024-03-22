import { Router } from "express";
import { PostController } from "./post.controller";
import { AuthMiddleware } from "../middleware/auth-middleware/auth.middleware";
import { checkAccessTime } from "./post.middleware";

const postController = new PostController();
const authMiddleware = new AuthMiddleware();
const router = Router();

router.patch(
  "/update-editor",
  authMiddleware.AuthenticationMiddleware,
  authMiddleware.AdminRoleMiddleware,
  postController.updateEditor
);

router.get("/:id", postController.findOne);

router.post(
  "/",
  authMiddleware.AuthenticationMiddleware,
  checkAccessTime,
  postController.post
);

router.get("/", postController.getAll);

router.get(
  "/mine",
  authMiddleware.AuthenticationMiddleware,
  postController.getByUserId
);

router.get(
  "/editor/mine",
  authMiddleware.AuthenticationMiddleware,
  authMiddleware.EditorRoleMiddleware,
  postController.getByEditorId
);

router.patch(
  "/editor/update/:postId",
  authMiddleware.AuthenticationMiddleware,
  authMiddleware.EditorRoleMiddleware,
  postController.updatePost
);

router.patch(
  "/update-tags",
  authMiddleware.AuthenticationMiddleware,
  authMiddleware.ViewerRoleMiddleware,
  postController.updateTags
);

router.delete(
  "/:postId",
  authMiddleware.AuthenticationMiddleware,
  authMiddleware.AdminRoleMiddleware,
  postController.delete
);

export default router;
