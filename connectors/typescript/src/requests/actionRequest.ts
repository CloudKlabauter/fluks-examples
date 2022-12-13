import {acknolwedgeMessage, sendActionResponse} from "../cloudgatewayApi";
import {IActionMessage, IActionReplyBase} from "../types/message";
import {v4 as uuid} from "uuid";
import {ICreateOrderParams, ICreateOrderResponse} from "../types/tradesmenTypes";

export const processActionRequest = async (msg: IActionMessage) => {
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

        const sendActionSuccess = await sendActionResponse({
            ...actionResponse,
            type: "ActionReply",
            payload: {Id: orderId} as ICreateOrderResponse,
        });

        if (sendActionSuccess) await acknolwedgeMessage(msg.messageId);
    } catch (err) {
        await sendActionResponse({
            ...actionResponse,
            type: "ActionFailure",
            failureReason: (err as Error).message,
            isTechnicalError: true,
        });
    }
};
