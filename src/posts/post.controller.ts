/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ApiResponseHandler } from "../utils/apiResponse.utils";
import { PostService } from "./post.service";
import { type Request, type Response } from "express";
const postService = new PostService();
export class PostController {
  async post(req: any, res: Response): Promise<void> {
    try {
      const post = req.body;
      const userId = req.user;
      const data = await postService.create(userId, post);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async updatePost(req: any, res: Response): Promise<void> {
    try {
      const post = req.body;
      const { postId } = req.params;

      const data = await postService.updatePost(+postId, post);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const data = await postService.findOne(+postId);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, perPage } = req.query;
      const data = await postService.findAll(
        page ? +page : 1,
        perPage ? +perPage : 10
      );
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async getByUserId(req: any, res: Response): Promise<void> {
    try {
      const { page, perPage } = req.query;
      const data = await postService.findByUserId(
        req.user,
        page ? +page : 1,
        perPage ? +perPage : 10
      );
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async getByEditorId(req: any, res: Response): Promise<void> {
    try {
      const { page, perPage } = req.query;
      console.log(req.user);
      const data = await postService.findByEditorId(
        req.user,
        page ? +page : 1,
        perPage ? +perPage : 10
      );
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async updateEditor(req: Request, res: Response): Promise<void> {
    try {
      const { postId, editorId } = req.body;
      const data = await postService.updateEditors(postId, editorId);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async updateTags(req: Request, res: Response): Promise<void> {
    try {
      const { postId, tags } = req.body;
      console.log(postId, tags);
      const data = await postService.updateTags(+postId, tags);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const data = await postService.remove(postId);
      ApiResponseHandler.handleSuccess(res, data);
    } catch (error: any) {
      ApiResponseHandler.handleError(res, 500, error?.message as string);
    }
  }
}
