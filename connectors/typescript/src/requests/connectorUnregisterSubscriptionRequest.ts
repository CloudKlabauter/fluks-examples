import { sendMessageReply } from "../cloudgatewayApi";
import { removeSubscription } from "../store/subscriptionStore";
import { IUnregisterSubscriptionMessage } from "../types/messageTypes";
import { IUnregisterSubscriptionMessageBase } from "../types/subscriptionTypes";

export const processConnectorUnregisterSubscriptionRequest = async (msg: IUnregisterSubscriptionMessage) => {
    const subscriptionResponse = {
        conversationId: msg.conversationId,
        tenantId: msg.tenantId,
        trigger: msg.trigger,
        subscriptionId: msg.subscriptionId,
    } as IUnregisterSubscriptionMessageBase;

    try {
        console.log(`Trigger '${msg.trigger}' unregistered with subscription id '${msg.subscriptionId}'`);

        await removeSubscription(msg.subscriptionId);

        await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorUnregisterSubscriptionReply",
        });
    } catch (err) {
        await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorUnregisterSubscriptionFailure",
            failureReason: (err as Error).message,
        });
    }
};
