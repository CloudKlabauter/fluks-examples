import {acknolwedgeMessage, sendMessageReply} from "../cloudgatewayApi";
import {saveSubscription} from "../store/subscriptionStore";
import {IRegisterSubscriptionMessage} from "../types/messageTypes";
import {IRegisterSubscriptionMessageBase} from "../types/subscriptionTypes";

export const processConnectorRegisterSubscriptionRequest = async (msg: IRegisterSubscriptionMessage) => {
    const subscriptionResponse = {
        conversationId: msg.conversationId,
        tenantId: msg.tenantId,
        trigger: msg.trigger,
        subscriptionId: msg.subscriptionId,
    } as IRegisterSubscriptionMessageBase;

    try {
        // Here should be your connector subscription logic
        console.log(
            `Trigger '${msg.trigger}' registered with subcription id '${
                msg.subscriptionId
            }' with filters '${JSON.stringify(msg.staticFilter)}`
        );

        const sendActionSuccess = await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorRegisterSubscriptionReply",
        });

        saveSubscription(msg);

        if (sendActionSuccess) await acknolwedgeMessage(msg.messageId);
    } catch (err) {
        await sendMessageReply({
            ...subscriptionResponse,
            type: "ConnectorRegisterSubscriptionFailure",
            failureReason: (err as Error).message,
        });
    }
};
