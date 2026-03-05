import { sendMessageReply } from "../cloudgatewayApi";
import { IActionMessage } from "../types/messageTypes";
import { IActionReplyBase } from "../types/actionTypes";
import { BINARY_ROUNDTRIP_ACTION_NAME, processBinaryStoreActionRequest } from "./binaryStoreActionRequest";
import { CREATE_ORDER_ACTION_NAME, processCreateOrderActionRequest } from "./createOrderActionRequest";

export const processActionRequest = async (msg: IActionMessage): Promise<boolean> => {
    const actionResponse = {
        conversationId: msg.conversationId,
        tenantId: msg.tenantId,
        action: msg.action,
    } as IActionReplyBase;

    try {
        switch (msg.action) {
            case CREATE_ORDER_ACTION_NAME:
                return await processCreateOrderActionRequest(msg, actionResponse);
            case BINARY_ROUNDTRIP_ACTION_NAME:
                return await processBinaryStoreActionRequest(msg, actionResponse);
            default:
                throw new Error(`Unknown action: ${msg.action}`);
        }
    } catch (err) {
        return await sendMessageReply({
            ...actionResponse,
            type: "ActionFailure",
            failureReason: (err as Error).message,
            isTechnicalError: true,
        });
    }
};
