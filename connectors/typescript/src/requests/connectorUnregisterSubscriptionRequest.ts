import { acknolwedgeMessage } from '../cloudgatewayApi';
import { ISubscriptionMessage } from '../types/message';

export const processConnectorUnregisterSubscriptionRequest = (msg: ISubscriptionMessage) => {
    console.log('Process ConnectorRegisterSubscriptionRequest ...');

    //TODO: Do things here ...

    acknolwedgeMessage(msg.messageId);
};
