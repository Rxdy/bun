import bcrypt from "bcrypt";

class Crypt {
    async hash(value: string, type: string): Promise<string> {
        if (type === "mail") {
            return await bcrypt.hash(value, process.env.HASH_MAIL);
        } else if (type === "pwd") {
            return await bcrypt.hash(value, process.env.HASH_MDP);
        }
    }

    async compare(value: string, valueHash: string): Promise<boolean> {
        return await bcrypt.compare(value, valueHash);
    }
}

export const crypt = new Crypt();
