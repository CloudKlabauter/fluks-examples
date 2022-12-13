export interface IMessageResponse {
    messages: IMessage[];
}

interface IMessageBase {
    messageId: string;
    type: string;
    tenantId: string;
    conversationId: string;
}

export interface IActionMessage extends IMessageBase {
    action: string;
    recipient: string;
    sender: string;
    payload: any;
}

interface ISubscriptionMessageBase extends IMessageBase {
    trigger: string;
    subscriptionId: string;
}

export interface IRegisterSubscriptionMessage extends ISubscriptionMessageBase {
    staticFilter: any;
}

export interface IUnregisterSubscriptionMessage extends ISubscriptionMessageBase {}

export type IMessage = IActionMessage | IRegisterSubscriptionMessage;

export const MESSAGE_TYPES = {
    ActionRequest: "ActionRequest",
    ConnectorRegisterSubscriptionRequest: "ConnectorRegisterSubscriptionRequest",
    ConnectorUnregisterSubscriptionRequest: "ConnectorUnregisterSubscriptionRequest",
};
