import { Env } from "../envSetup.js";

export class CacheManager {

    private static cache: Record<string, { data: any, expirefn: () => void }> = {};
    private static timeout = 12 * 60 * 60 * 1000; // 12 hours

    static get<T>(key: string): T | null {
        if (Env.GENERAL.includes("nocache")) {
            return null;
        }
        if (this.cache[key]) {
            return this.cache[key].data as T;
        }
        return null;
    }

    static set<T>(key: string, data: T, timeout: number = CacheManager.timeout): void {
        if (Env.GENERAL.includes("nocache")) {
            return;
        }
        if (this.cache[key]) {
            this.cache[key].expirefn();
        }
        const expirefn = () => {
            setTimeout(() => {
                delete this.cache[key];
            }, timeout);
        };
        this.cache[key] = { data, expirefn };
        expirefn();
    }
    static search<T>(predicate: (data: T) => boolean) {
        if (Env.GENERAL.includes("nocache")) {
            return [];
        }
        return Object.values(this.cache)
            .map(item => item.data as T)
            .filter(predicate);
    }

    static getAllKeys() {
        return this.cache;
    }

}