import { ApiResponseHandler } from "../utils/apiResponse.utils";
import { RoleService } from "./roles.service";
import { type Request, type Response } from "express";
const roleService = new RoleService();
export class RoleController {
  async post(req: Request, res: Response): Promise<void> {
    const role = req.body;
    console.log(role);
    const data = await roleService.create(role);
    ApiResponseHandler.handleSuccess(res, data);
  }

  async get(req: Request, res: Response): Promise<void> {
    const data = await roleService.findAll();
    ApiResponseHandler.handleSuccess(res, data);
  }
}
