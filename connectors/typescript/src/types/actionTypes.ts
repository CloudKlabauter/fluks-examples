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

export type ActionReply = IActionReply | IActionFailure;