import { Request, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { ErrorMessageEnum } from "../enums/errorMessage.enum";
import { HttpStatusCodeEnum } from "../enums/httpStatusCode.enum";
import UserService from "../services/user.service";

@controller("/user")
export default class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @httpGet("/:id")
    public async getUsernameByParamsId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await this.userService.findUserById(id);
            if (!user) {
                return res
                    .status(HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: "User is not found" });
            }
            return res.status(HttpStatusCodeEnum.OK).json(user);
        } catch (error) {
            return res
                .status(HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: ErrorMessageEnum.BAD_REQUEST });
        }
    }
}
