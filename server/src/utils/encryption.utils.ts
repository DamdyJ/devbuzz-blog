import bcrypt from "bcrypt";
import { injectable } from "inversify";

@injectable()
export default class EncryptionUtil {
    public async hashing(data: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt);
    }
    public async hashValidation(password: string, hashPassword: string) {
        return await bcrypt.compare(password, hashPassword);
    }
}
