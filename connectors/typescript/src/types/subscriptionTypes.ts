interface ISubscriptionReplyBase {
    tenantId: string;
    trigger: string;
    conversationId: string;
    subscriptionId: string;
}

// Types for ConnectorRegisterSubscription

export interface IRegisterSubscriptionMessageBase extends ISubscriptionReplyBase {
    type: "ConnectorRegisterSubscriptionReply" | "ConnectorRegisterSubscriptionFailure";
}

export interface IConnectorRegisterSubscriptionReply extends IRegisterSubscriptionMessageBase {}

export interface IConnectorRegisterSubscriptionFailure extends IRegisterSubscriptionMessageBase {
    failureReason: string;
}

export type SubscriptionRegisterReply = IConnectorRegisterSubscriptionReply | IConnectorRegisterSubscriptionFailure;

// Types for ConnectorUnregisterSubscription

export interface IUnregisterSubscriptionMessageBase extends ISubscriptionReplyBase {
    type: "ConnectorUnregisterSubscriptionReply" | "ConnectorUnregisterSubscriptionFailure";
}

export interface IConnectorUnregisterSubscriptionReply extends IUnregisterSubscriptionMessageBase {}

export interface IConnectorUnregisterSubscriptionFailure extends IUnregisterSubscriptionMessageBase {
    failureReason: string;
}

export type SubscriptionUnregisterReply =
    | IConnectorUnregisterSubscriptionReply
    | IConnectorUnregisterSubscriptionFailure;
