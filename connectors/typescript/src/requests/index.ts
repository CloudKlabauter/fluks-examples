import {IActionMessage, IMessage, IRegisterSubscriptionMessage, IUnregisterSubscriptionMessage, MESSAGE_TYPES} from "../types/messageTypes";
import {processActionRequest} from "./actionRequest";
import {processConnectorRegisterSubscriptionRequest} from "./connectorRegisterSubscriptionRequest";
import {processConnectorUnregisterSubscriptionRequest} from "./connectorUnregisterSubscriptionRequest";

export const processRequest = async (msg: IMessage) => {
    console.log(`Process message: ${msg.type}`);

    switch (msg.type) {
        case MESSAGE_TYPES.ActionRequest:
            await processActionRequest(msg as IActionMessage);
            break;
        case MESSAGE_TYPES.ConnectorRegisterSubscriptionRequest:
            await processConnectorRegisterSubscriptionRequest(msg as IRegisterSubscriptionMessage);
            break;
        case MESSAGE_TYPES.ConnectorUnregisterSubscriptionRequest:
            await processConnectorUnregisterSubscriptionRequest(msg as IUnregisterSubscriptionMessage);
            break;
        default:
            console.log(`Unkown message type: ${msg.type}`);
            break;
    }
};
