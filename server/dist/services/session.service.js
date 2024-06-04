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
let SessionService = class SessionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findSessionByUserId(userId) {
        return await this.prisma.session.findUnique({
            where: { user_id: userId },
        });
    }
    async findSessionByRefreshToken(refreshToken) {
        return await this.prisma.session.findFirst({
            where: { refresh_token: refreshToken },
        });
    }
    async update(userId, refreshToken, expiredAt) {
        return await this.prisma.session.update({
            where: { user_id: userId },
            data: { refresh_token: refreshToken, expired_at: expiredAt },
        });
    }
    /**
     *
     * @param userId User ID from User Model
     * @param refreshToken Refresh Token that get generated from sign in or sign up
     * @param expiredAt Get the expired date from refresh token
     * @returns A promise that resolves to the created session object.
     */
    async create(userId, refreshToken, expiredAt) {
        return await this.prisma.session.create({
            data: {
                user_id: userId,
                refresh_token: refreshToken,
                expired_at: expiredAt,
            },
        });
    }
    async delete(userId) {
        return await this.prisma.session.delete({ where: { user_id: userId } });
    }
};
SessionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SessionService);
exports.default = SessionService;
//# sourceMappingURL=session.service.js.map