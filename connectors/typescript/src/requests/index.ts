import { acknolwedgeMessage } from "../cloudgatewayApi";
import {
    IActionMessage,
    IMessage,
    IRegisterSubscriptionMessage,
    IUnregisterSubscriptionMessage,
    MESSAGE_TYPES,
} from "../types/messageTypes";
import { processActionRequest } from "./actionRequest";
import { processConnectorRegisterSubscriptionRequest } from "./connectorRegisterSubscriptionRequest";
import { processConnectorUnregisterSubscriptionRequest } from "./connectorUnregisterSubscriptionRequest";

export const processRequest = async (msg: IMessage) => {
    console.log(`Process message: ${msg.type}`);

    try {
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
    } finally {
        // Acknowledging tells fluks this incoming message is now done on connector side.
        // From this point, completion responsibility is no longer with fluks.
        // If a connector does not acknowledge, fluks will redeliver the exact same message
        // repeatedly to guarantee the message is not lost.
        await acknolwedgeMessage(msg.messageId);
    }
};
