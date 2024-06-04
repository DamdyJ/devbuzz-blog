"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const inversify_1 = require("inversify");
let EncryptionUtil = class EncryptionUtil {
    async hashing(data) {
        const salt = await bcrypt_1.default.genSalt(10);
        return await bcrypt_1.default.hash(data, salt);
    }
    async hashValidation(password, hashPassword) {
        return await bcrypt_1.default.compare(password, hashPassword);
    }
};
EncryptionUtil = __decorate([
    (0, inversify_1.injectable)()
], EncryptionUtil);
exports.default = EncryptionUtil;
//# sourceMappingURL=encryption.utils.js.map