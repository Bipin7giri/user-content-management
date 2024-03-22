/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ApiSuccessStatus } from "../constant/message.constant";
import { UserRole } from "../enum/user-role.enum";
import { Role } from "../roles/roles.schema";
import { User } from "../users/user.schema";
import { comparePassword, generateHashPassword } from "../utils/hashpassword";
import { generateToken } from "../utils/jwt";
import { type Response } from "express";
interface RegisterUserIF {
  email: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly userModel = User,
    private readonly roleModel = Role
  ) {}

  async registerViewer(data: RegisterUserIF): Promise<string> {
    try {
      const roles = await this.roleModel.find({ name: UserRole.VIEWER });

      const hashedPassword: any = await generateHashPassword(data.password);
      const user = await this.userModel.create({
        email: data.email,
        password: hashedPassword,
        roles,
      });
      await this.roleModel.findOneAndUpdate(
        {
          name: UserRole.VIEWER,
        },
        {
          $push: { users: user },
        }
      );
      return ApiSuccessStatus.SUCCESS;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  async registerEditor(data: RegisterUserIF): Promise<string> {
    try {
      const roles = await this.roleModel.find({ name: UserRole.EDITOR });
      const hashedPassword: any = await generateHashPassword(data.password);
      const user = await this.userModel.create({
        password: hashedPassword,
        email: data.email,
        roles,
      });
      await this.roleModel.findOneAndUpdate(
        {
          name: UserRole.EDITOR,
        },
        {
          $push: { users: user },
        }
      );
      return ApiSuccessStatus.SUCCESS;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  async registerAdmin(data: RegisterUserIF): Promise<string> {
    try {
      const roles = await this.roleModel.find({ name: UserRole.ADMIN });
      const hashedPassword: any = await generateHashPassword(data.password);
      const user = await this.userModel.create({
        password: hashedPassword,
        email: data.email,
        roles,
      });
      await this.roleModel.findOneAndUpdate(
        {
          name: UserRole.ADMIN,
        },
        {
          $push: { users: user },
        }
      );
      return ApiSuccessStatus.SUCCESS;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  async login({
    email,
    password,
    res,
  }: {
    email: string;
    password: string;
    res: Response;
  }): Promise<void> {
    try {
      try {
        const user: any = await this.userModel
          .findOne({
            email,
          })
          .populate("roles");
        if (user) {
          const checkPassword: boolean = await comparePassword(
            user.password,
            password
          );
          if (checkPassword) {
            const accessToken: any = await generateToken(user);

            res.json({
              access_token: accessToken,
              message: "Login successful !!",
              status: 200,
              role: user.roles[0].name,
            });
          } else {
            res.status(401).json({
              message: "Invalid password !!",
              status: 404,
            });
          }
        } else {
          res.status(401).json({
            message: "No email found or Blocked",
            status: 404,
          });
        }
      } catch (err: any) {
        res.status(422).send({ error: true, message: err.message });
      }
    } catch (err: any) {
      res.status(422).send({ error: true, message: err.message, status: 422 });
    }
  }
}
