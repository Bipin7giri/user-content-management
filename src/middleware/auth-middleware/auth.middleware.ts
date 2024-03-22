/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */

import { type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../../enum/user-role.enum";
export class AuthMiddleware {
  AuthenticationMiddleware(req: any, res: Response, next: NextFunction) {
    let authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!authHeader) {
      return res.status(401).json({
        message: "No access_token found",
      });
    }
    jwt.verify(authHeader, "json_web_token_pw", async (err: any) => {
      try {
        if (Boolean(err))
          return res.status(401).json({
            message: "unauthorized access",
          });
        const currentUser: {
          id: number;
          email: string;
          iat: number;
          exp: number;
          role: [];
        } = getCurrentUser(authHeader);
        req.user = currentUser.id;
        req.role = currentUser.role;
        next();
      } catch (err) {
        res.send(err);
      }
    });
  }

  EditorRoleMiddleware(req: any, res: Response, next: NextFunction): void {
    if (req?.role === UserRole.EDITOR) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  }

  ViewerRoleMiddleware(req: any, res: Response, next: NextFunction): void {
    console.log("i am here");
    console.log(req.role === UserRole.VIEWER);
    if (req?.role === UserRole.VIEWER) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  }

  AdminRoleMiddleware(req: any, res: Response, next: NextFunction): void {
    if (req?.role === UserRole.ADMIN) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  }
}
export function getCurrentUser(token: string): any {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
