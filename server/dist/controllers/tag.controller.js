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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const tag_service_1 = __importDefault(require("../services/tag.service"));
const inversify_1 = require("inversify");
const httpStatusCode_enum_1 = require("../enums/httpStatusCode.enum");
let TagController = class TagController {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    async findAllTags(req, res) {
        try {
            const tags = await this.tagService.findAllTags();
            console.log(tags);
            return res.status(200).json(tags);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    async createTag(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }
            const hasName = await this.tagService.findTagbyName(name);
            if (hasName) {
                return res
                    .status(httpStatusCode_enum_1.HttpStatusCodeEnum.CONFLICT)
                    .json({ message: "Name already exsists" });
            }
            // Call the create method
            const tag = await this.tagService.create(name);
            // Return the created tag
            return res.status(201).json(tag);
        }
        catch (error) {
            console.error("Error creating tag:", error); // Log the error for debugging
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};
__decorate([
    (0, inversify_express_utils_1.httpGet)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "findAllTags", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "createTag", null);
TagController = __decorate([
    (0, inversify_express_utils_1.controller)("/tag"),
    __param(0, (0, inversify_1.inject)(tag_service_1.default)),
    __metadata("design:paramtypes", [tag_service_1.default])
], TagController);
exports.default = TagController;
//# sourceMappingURL=tag.controller.js.map