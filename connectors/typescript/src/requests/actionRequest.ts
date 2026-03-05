import { sendMessageReply } from "../cloudgatewayApi";
import { IActionMessage } from "../types/messageTypes";
import { v4 as uuid } from "uuid";
import { ICreateOrderParams, ICreateOrderResponse } from "../types/tradesmenTypes";
import { IActionReplyBase } from "../types/actionTypes";

export const processActionRequest = async (msg: IActionMessage): Promise<boolean> => {
    const {ClientAdress, OrderText} = msg.payload as ICreateOrderParams;
    const actionResponse = {
        conversationId: msg.conversationId,
        tenantId: msg.tenantId,
        action: msg.action,
    } as IActionReplyBase;

    try {
        // Here should be your connector action logic
        const orderId = uuid();
        console.log(`Order created with id '${orderId}': (${OrderText}) for ${ClientAdress}`);

        return await sendMessageReply({
            ...actionResponse,
            type: "ActionReply",
            payload: {Id: orderId} as ICreateOrderResponse,
        });
    } catch (err) {
        return await sendMessageReply({
            ...actionResponse,
            type: "ActionFailure",
            failureReason: (err as Error).message,
            isTechnicalError: true,
        });
    }
};
