"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const errorMessage_enum_1 = require("../enums/errorMessage.enum");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
const user_service_1 = __importDefault(require("../services/user.service"));
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getUsernameByParamsId(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.findUserById(id);
            if (!user) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.NOT_FOUND)
                    .json({ message: "User is not found" });
            }
            return res.status(httpStatusCode_enum_1.HttpStatusCodeEnum.OK).json(user);
        }
        catch (error) {
            return res
                .status(httpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST)
                .json({ error, message: errorMessage_enum_1.ErrorMessageEnum.BAD_REQUEST });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsernameByParamsId", null);
UserController = __decorate([
    (0, inversify_express_utils_1.controller)("/user"),
    __metadata("design:paramtypes", [user_service_1.default])
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map