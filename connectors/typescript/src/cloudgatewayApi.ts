import { processRequest } from "./requests";
import { ActionReply } from "./types/actionTypes";
import { IMessage, IMessageResponse } from "./types/messageTypes";
import { SubscriptionRegisterReply, SubscriptionUnregisterReply } from "./types/subscriptionTypes";
import { ITriggerReply } from "./types/triggerTypes";

export const getMessagesAll10Minutes = (callback: (msgs: IMessage[]) => Promise<void> | void) => {
    setInterval(async () => {
        try {
            const messageResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/messages`, {
                method: "GET",
                headers: {
                    "X-API-Key": process.env.FLUKS_API_KEY!,
                },
            });

            if (messageResponse.ok) {
                const messageData = (await messageResponse.json()) as IMessageResponse;
                console.log(messageData);
                await callback(messageData.messages);
                return;
            }

            const { status, statusText } = messageResponse;
            console.error(`${status}: ${statusText}`);
        } catch (error) {
            console.error(`Polling messages failed: ${(error as Error).message}`);
        }
    }, 60000 * 10);
};

export const processMessages = async (msgs: IMessage[]) => {
    if (msgs.length === 0) console.log("No messages to process.");

    for (const msg of msgs) {
        await processRequest(msg);
    }
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

export const uploadTextBinary = async (
    tenantId: string,
    fileName: string,
    text: string
): Promise<{ downloadPermitToken: string; binaryId: string }> => {
    const formData = new FormData();
    formData.append("streamPart", new Blob([text], { type: "text/plain; charset=utf-8" }), fileName);

    const response = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/binaries?tenantId=${encodeURIComponent(tenantId)}`, {
        method: "POST",
        headers: {
            "X-API-Key": process.env.FLUKS_API_KEY!,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Upload binary failed: ${response.status} ${response.statusText}`);
    }

    const body = (await response.json()) as Partial<{ downloadPermitToken: string; binaryId: string }>;
    if (!body.downloadPermitToken || !body.binaryId) {
        throw new Error("Upload binary response is missing required fields.");
    }

    return {
        downloadPermitToken: body.downloadPermitToken,
        binaryId: body.binaryId,
    };
};

export const downloadTextBinary = async (permitToken: string): Promise<string> => {
    const response = await fetch(
        `${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/binaries?permitToken=${encodeURIComponent(permitToken)}`,
        {
            method: "GET",
            headers: {
                "X-API-Key": process.env.FLUKS_API_KEY!,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Download binary failed: ${response.status} ${response.statusText}`);
    }

    return await response.text();
};
