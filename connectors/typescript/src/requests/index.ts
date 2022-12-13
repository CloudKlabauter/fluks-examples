import {IActionMessage, IMessage, ISubscriptionMessage, MESSAGE_TYPES} from "../types/message";
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
            processConnectorRegisterSubscriptionRequest(msg as ISubscriptionMessage);
            break;
        case MESSAGE_TYPES.ConnectorUnregisterSubscriptionRequest:
            processConnectorUnregisterSubscriptionRequest(msg as ISubscriptionMessage);
            break;
        default:
            console.log(`Unkown message type: ${msg.type}`);
            break;
    }
};
