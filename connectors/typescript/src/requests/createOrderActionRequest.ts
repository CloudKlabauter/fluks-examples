import { sendMessageReply } from "../cloudgatewayApi";
import { IActionReplyBase } from "../types/actionTypes";
import { IActionMessage } from "../types/messageTypes";
import { ICreateOrderParams, ICreateOrderResponse } from "../types/tradesmenTypes";
import { v4 as uuid } from "uuid";

export const CREATE_ORDER_ACTION_NAME = "CreateOrder";

export const processCreateOrderActionRequest = async (
    msg: IActionMessage,
    actionResponse: IActionReplyBase
): Promise<boolean> => {
    const { ClientAdress, OrderText } = msg.payload as ICreateOrderParams;

    const orderId = uuid();
    console.log(`Order created with id '${orderId}': (${OrderText}) for ${ClientAdress}`);

    return await sendMessageReply({
        ...actionResponse,
        type: "ActionReply",
        payload: { Id: orderId } as ICreateOrderResponse,
    });
};
