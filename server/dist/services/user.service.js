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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     *
     * @param username
     * @param email
     * @param password
     * @returns
     */
    async create(username, email, password) {
        return await this.prisma.user.create({
            data: { username, email, password },
        });
    }
    /**
     *
     * @returns user promise
     */
    async findAllUsers() {
        return await this.prisma.user.findMany();
    }
    async findUserById(id) {
        return await this.prisma.user.findFirst({ where: { id } });
    }
    async findUserByEmail(email) {
        return await this.prisma.user.findFirst({
            where: { email },
        });
    }
    async findUserByUsername(username) {
        return await this.prisma.user.findFirst({ where: { username } });
    }
    async findUserByIdAndGetEmail(id) {
        return await this.prisma.user.findFirst({
            where: { id },
            select: { email: true },
        });
    }
};
UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map