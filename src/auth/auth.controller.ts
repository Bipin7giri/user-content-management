import { ApiResponseHandler } from "../utils/apiResponse.utils";
import { type Request, type Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  // async registerUser(req: Request, res: Response): Promise<void> {
  //   const data = await authService.registerUser(req.body);
  //   ApiResponseHandler.handleSuccess(res, data);
  // }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    await authService.login({ email, password, res });
  }

  async registerViewer(req: Request, res: Response): Promise<void> {
    const data = await authService.registerViewer(req.body);
    ApiResponseHandler.handleSuccess(res, data);
  }

  async registerEditor(req: Request, res: Response): Promise<void> {
    const data = await authService.registerEditor(req.body);
    ApiResponseHandler.handleSuccess(res, data);
  }

  async registerAdmin(req: Request, res: Response): Promise<void> {
    const data = await authService.registerAdmin(req.body);
    ApiResponseHandler.handleSuccess(res, data);
  }
}
