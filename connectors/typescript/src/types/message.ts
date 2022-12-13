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

export interface ISubscriptionMessage extends IMessageBase {
    trigger: string;
    subscriptionId: string;
    staticFilter: any;
}

export type IMessage = IActionMessage | ISubscriptionMessage;

export interface IActionReplyBase {
    type: "ActionReply" | "ActionFailure";
    tenantId: string;
    action: string;
    conversationId: string;
}

export interface IActionReply extends IActionReplyBase {
    payload: any;
}

export interface IActionFailure extends IActionReplyBase {
    failureReason: string;
    isTechnicalError: boolean;
}

export const MESSAGE_TYPES = {
    ActionRequest: "ActionRequest",
    ConnectorRegisterSubscriptionRequest: "ConnectorRegisterSubscriptionRequest",
    ConnectorUnregisterSubscriptionRequest: "ConnectorUnregisterSubscriptionRequest",
};
