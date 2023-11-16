export interface ITriggerReply {
    type: "Trigger";
    tenantId: string;
    trigger: string;
    subscriptionId: string;
    payload: any;
    binaryIds: string[];
}
