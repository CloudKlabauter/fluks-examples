import { IRegisterSubscriptionMessage } from "../types/messageTypes";
import * as fs from "fs";

const STORE_FILE_NAME = "subscriptions.json";

interface ISubscriptionInfo {
    subscriptionId: string;
    trigger: string;
    filter: any;
    tenantId: string;
}

const readSubscriptions = (): ISubscriptionInfo[] => {
    try {
        if (!fs.existsSync(STORE_FILE_NAME)) {
            return [];
        }

        const data = fs.readFileSync(STORE_FILE_NAME, "utf-8");
        return JSON.parse(data) as ISubscriptionInfo[];
    } catch (error) {
        console.error(`Failed to read or parse subscription store file "${STORE_FILE_NAME}":`, error);
        throw error;
    }
};

const saveSubscriptions = (subscriptions: ISubscriptionInfo[]): void => {
    fs.writeFileSync(STORE_FILE_NAME, JSON.stringify(subscriptions));
};

export const saveSubscription = (subscription: IRegisterSubscriptionMessage): void => {
    const subscriptionInfo: ISubscriptionInfo = {
        subscriptionId: subscription.subscriptionId,
        trigger: subscription.trigger,
        filter: subscription.staticFilter,
        tenantId: subscription.tenantId,
    };

    const subscriptionInfos = readSubscriptions();
    subscriptionInfos.push(subscriptionInfo);
    saveSubscriptions(subscriptionInfos);
};

export const removeSubscription = (subscriptionId: string): void => {
    const subscriptionInfos = readSubscriptions().filter((s) => s.subscriptionId !== subscriptionId);
    saveSubscriptions(subscriptionInfos);
};

export const getSubscriptionsForFilter = (
    triggerId: string,
    filter: any
): Promise<ISubscriptionInfo[]> => {
    const subscriptionInfos = readSubscriptions();
    return Promise.resolve(
        subscriptionInfos.filter((s) => s.trigger === triggerId && JSON.stringify(s.filter) === JSON.stringify(filter))
    );
};
