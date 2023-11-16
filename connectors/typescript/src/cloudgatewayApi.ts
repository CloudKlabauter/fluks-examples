import { processRequest } from "./requests";
import { IActionReply, IActionFailure, ActionReply } from "./types/actionTypes";
import { IMessage, IMessageResponse } from "./types/messageTypes";
import { SubscriptionRegisterReply, SubscriptionUnregisterReply } from "./types/subscriptionTypes";
import { ITriggerReply } from "./types/triggerTypes";

export const getMessagesAll10Minutes = (callback: (msgs: IMessage[]) => void) => {
    var intr = setInterval(async () => {
        const messageResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/messages`, {
            method: "GET",
            headers: {
                "X-API-Key": process.env.FLUKS_API_KEY!,
            },
        });

        if (messageResponse.ok) {
            const messageData = (await messageResponse.json()) as IMessageResponse;
            console.log(messageData);
            callback(messageData.messages);
        } else {
            const { status, statusText } = messageResponse;
            clearInterval(intr);
            throw new Error(`${status}: ${statusText}`);
        }
    }, 60000 * 10);
};

export const processMessages = async (msgs: IMessage[]) => {
    if (msgs.length === 0) console.log("No messages to process.");
    msgs.forEach(await processRequest);
};

export const acknolwedgeMessage = async (msgId: string): Promise<boolean> => {
    const body = {
        messageIds: [msgId],
    };

    const ackMessageResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/messages/ack`, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            "X-API-Key": process.env.FLUKS_API_KEY!,
        },
        body: JSON.stringify(body),
    });

    if (!ackMessageResponse.ok) {
        console.error(`Error acknowledging message with id '${msgId}': ${ackMessageResponse.statusText}`);
    } else {
        console.log(`acknowledging message with id '${msgId}' sended.`);
    }

    return ackMessageResponse.ok;
};

export const sendMessageReply = async (
    respMsg: ActionReply | SubscriptionRegisterReply | SubscriptionUnregisterReply
): Promise<boolean> => {
    const actionReplyResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/messages/reply`, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            "X-API-Key": process.env.FLUKS_API_KEY!,
        },
        body: JSON.stringify(respMsg),
    });

    if (!actionReplyResponse.ok) {
        console.error(
            `Error reply message for conversationId '${respMsg.conversationId}': ${actionReplyResponse.statusText}`
        );
    }

    return actionReplyResponse.ok;
};

export const sendTriggerExecution = async (respMsg: ITriggerReply): Promise<boolean> => {
    const triggerReplyResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/trigger`, {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            "X-API-Key": process.env.FLUKS_API_KEY!,
        },
        body: JSON.stringify(respMsg),
    });

    if (!triggerReplyResponse.ok) {
        console.error(
            `Error reply trigger execution message for subscriptionId '${respMsg.subscriptionId}': ${triggerReplyResponse.statusText}`
        );
    }

    return triggerReplyResponse.ok;
};
