import {IRegisterSubscriptionMessage} from "../types/messageTypes";
import * as fs from "fs";

const STORE_FILE_NAME = "subscriptions.json";

interface ISubscriptionInfo {
    subscriptionId: string;
    trigger: string;
    filter: any;
    tenantId: string;
}

export const saveSubscription = (subscription: IRegisterSubscriptionMessage) => {
    const subscriptionInfo = {
        subscriptionId: subscription.subscriptionId,
        trigger: subscription.trigger,
        filter: subscription.staticFilter,
        tenantId: subscription.tenantId,
    };

    let subscriptionInfos: ISubscriptionInfo[] = [];
    fs.readFile(STORE_FILE_NAME, (err, data) => {
        if (!err) subscriptionInfos = JSON.parse(data.toString()) as ISubscriptionInfo[];

        subscriptionInfos.push(subscriptionInfo);

        fs.writeFileSync(STORE_FILE_NAME, JSON.stringify(subscriptionInfos));
    });
};

export const removeSubscription = (subscriptionId: string) => {
    let subscriptionInfos: ISubscriptionInfo[] = [];
    fs.readFile(STORE_FILE_NAME, (err, data) => {
        if (!err) subscriptionInfos = JSON.parse(data.toString()) as ISubscriptionInfo[];

        const newSubscriptionInfos = subscriptionInfos.filter((s) => s.subscriptionId !== subscriptionId);

        fs.writeFileSync(STORE_FILE_NAME, JSON.stringify(newSubscriptionInfos));
    });
};

export const getSubscriptionsForFilter = (
    triggerId: string,
    filter: string,
    callback: (subscriptions: ISubscriptionInfo[]) => void
) => {
    let subscriptionInfos: ISubscriptionInfo[] = [];

    fs.readFile(STORE_FILE_NAME, (err, data) => {
        if (!err) subscriptionInfos = JSON.parse(data.toString()) as ISubscriptionInfo[];
        callback(subscriptionInfos.filter((s) => s.trigger === triggerId &&  JSON.stringify(s.filter) === JSON.stringify(filter)));
    });
};
