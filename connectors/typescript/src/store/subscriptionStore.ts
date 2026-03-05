import { IRegisterSubscriptionMessage } from "../types/messageTypes";
import * as fs from "fs/promises";

const STORE_FILE_NAME = "subscriptions.json";

interface ISubscriptionInfo {
    subscriptionId: string;
    trigger: string;
    filter: any;
    tenantId: string;
}

const readSubscriptions = async (): Promise<ISubscriptionInfo[]> => {
    try {
        await fs.access(STORE_FILE_NAME);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        console.error(`Failed to access subscription store file "${STORE_FILE_NAME}":`, error);
        throw error;
    }

    try {
        const data = await fs.readFile(STORE_FILE_NAME, "utf-8");
        return JSON.parse(data) as ISubscriptionInfo[];
    } catch (error) {
        console.error(`Failed to read or parse subscription store file "${STORE_FILE_NAME}":`, error);
        throw error;
    }
};

const saveSubscriptions = async (subscriptions: ISubscriptionInfo[]): Promise<void> => {
    try {
        await fs.writeFile(STORE_FILE_NAME, JSON.stringify(subscriptions));
    } catch (error) {
        console.error(`Failed to write subscription store file "${STORE_FILE_NAME}":`, error);
        throw error;
    }
};

export const saveSubscription = async (subscription: IRegisterSubscriptionMessage): Promise<void> => {
    const subscriptionInfo: ISubscriptionInfo = {
        subscriptionId: subscription.subscriptionId,
        trigger: subscription.trigger,
        filter: subscription.staticFilter,
        tenantId: subscription.tenantId,
    };

    const subscriptionInfos = await readSubscriptions();
    subscriptionInfos.push(subscriptionInfo);
    await saveSubscriptions(subscriptionInfos);
};

export const removeSubscription = async (subscriptionId: string): Promise<void> => {
    const subscriptionInfos = (await readSubscriptions()).filter((s) => s.subscriptionId !== subscriptionId);
    await saveSubscriptions(subscriptionInfos);
};

const canonicalizeFilter = (value: any): any => {
    if (value === null || typeof value !== "object") {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(canonicalizeFilter);
    }
    return Object.keys(value)
        .sort()
        .reduce((acc: Record<string, any>, key) => {
            acc[key] = canonicalizeFilter(value[key]);
            return acc;
        }, {});
};

export const getSubscriptionsForFilter = async (
    triggerId: string,
    filter: any
): Promise<ISubscriptionInfo[]> => {
    const subscriptionInfos = await readSubscriptions();
    const normalizedFilter = JSON.stringify(canonicalizeFilter(filter));
    return subscriptionInfos.filter(
        (s) => s.trigger === triggerId && JSON.stringify(canonicalizeFilter(s.filter)) === normalizedFilter
    );
};
