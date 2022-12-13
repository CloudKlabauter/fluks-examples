import { acknolwedgeMessage } from "../cloudgatewayApi";
import { ISubscriptionMessage } from "../types/message";

export const processConnectorRegisterSubscriptionRequest = (msg: ISubscriptionMessage) => {
    console.log('Process ConnectorRegisterSubscriptionRequest ...');

    //TODO: Do things here ...

    acknolwedgeMessage(msg.messageId);
};
