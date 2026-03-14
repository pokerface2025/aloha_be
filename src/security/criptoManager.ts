import * as crypto from "crypto";
import { Env } from "../envSetup.js";

interface EncryptionResult {
    iv: string;
    encryptedData: string;
}

export class CryptoManager {

    private static algorithm: "aes-256-gcm" = "aes-256-gcm";
    private static key: Uint8Array;

    /**
     * Initializes the CryptoManager with a password and salt.
     * The password is used to derive a key for encryption and decryption.
     * 
     * @param password - The password used for key derivation.
     * @param salt - A salt value to enhance security.
     */

    static init() {
        if (!Env.CRYPTOSALT || !Env.CRYPTOPASS) {
            console.error("CRYPTOSALT and CRYPTOPASS environment variables must be set.");
            CryptoManager.generateRamdomBytes(16);
            return;
        }
        // Derive a 32-byte key from the password and salt
        this.key = new Uint8Array(crypto.scryptSync(Env.CRYPTOPASS, Env.CRYPTOSALT, 32));

    }

    static encrypt(text: string): EncryptionResult {
        // Generate a random initialization vector
        const iv = crypto.randomBytes(16);

        // Create cipher instance
        const cipher = crypto.createCipheriv(this.algorithm, this.key, new Uint8Array(iv));

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
    }

    static decrypt(data: string): string {
        // Convert hex strings back to buffers
        const [encryptedData, iv]: any = data.split("-");
        const ivBuffer = new Uint8Array(Buffer.from(iv, 'hex'));

        // Create decipher instance
        const decipher = crypto.createDecipheriv(CryptoManager.algorithm, CryptoManager.key, ivBuffer);

        // Decrypt the data
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        // decrypted += decipher.final('utf8');

        return decrypted;
    }

    static generateRamdomBytes(length: number) {
        console.log(crypto.randomBytes(length).toString('hex'))
    }

}