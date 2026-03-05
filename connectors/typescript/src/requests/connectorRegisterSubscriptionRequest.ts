import { sendMessageReply } from "../cloudgatewayApi";
import { saveSubscription } from "../store/subscriptionStore";
import { IRegisterSubscriptionMessage } from "../types/messageTypes";
import { IRegisterSubscriptionMessageBase } from "../types/subscriptionTypes";

export const processConnectorRegisterSubscriptionRequest = async (msg: IRegisterSubscriptionMessage): Promise<boolean> => {
    const subscriptionResponse = {
        conversationId: msg.conversationId,
        tenantId: msg.tenantId,
        trigger: msg.trigger,
        subscriptionId: msg.subscriptionId,
    } as IRegisterSubscriptionMessageBase;

    try {
        // Here should be your connector subscription logic
        console.log(
            `Trigger '${msg.trigger}' registered with subscription id '${
                msg.subscriptionId
            }' with filters '${JSON.stringify(msg.staticFilter)}`
        );

        await saveSubscription(msg);

        return await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorRegisterSubscriptionReply",
        });
    } catch (err) {
        return await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorRegisterSubscriptionFailure",
            failureReason: (err as Error).message,
        });
    }
};
