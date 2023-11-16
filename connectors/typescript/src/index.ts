import express from "express";
import dotenv from "dotenv";
import { getMessagesAll10Minutes, processMessages, sendMessageReply, sendTriggerExecution } from "./cloudgatewayApi";
import { IMessageResponse } from "./types/messageTypes";
import { ITriggerReply } from "./types/triggerTypes";
import { IOrderCompletedResponse } from "./types/tradesmenTypes";
import { getSubscriptionsForFilter } from "./store/subscriptionStore";
import bodyParser from "body-parser";

dotenv.config({ path: ".env" });

const app = express();
const jsonParser = bodyParser.json();

app.get("/notify", async (req, res) => {
    const messageResponse = await fetch(`${process.env.FLUKS_CLOUD_GATEWAY_URL}/api/messages`, {
        method: "GET",
        headers: {
            "X-API-Key": process.env.FLUKS_API_KEY!,
        },
    });

    if (messageResponse.ok) {
        const messageDate = (await messageResponse.json()) as IMessageResponse;
        processMessages(messageDate.messages);

        res.sendStatus(200);
    } else {
        const { status, statusText } = messageResponse;
        console.error(`${status}: ${statusText}`);

        res.sendStatus(400);
    }
});

app.post("/order/complete", jsonParser, async (req, res) => {
    try {
        const triggerId = "ck.fluks.examples.connectors.tradesmen.ordercompleted@1";
        const filter = req.body.filter;
        getSubscriptionsForFilter(triggerId, filter, (subscriptions) => {
            if (subscriptions.length === 0) console.log("No subscriptions found.");

            subscriptions.forEach(async (subscription) => {
                const triggerExecutionReply: ITriggerReply = {
                    type: "Trigger",
                    subscriptionId: subscription.subscriptionId,
                    tenantId: subscription.tenantId,
                    trigger: subscription.trigger,
                    payload: req.body.payload as IOrderCompletedResponse,
                    binaryIds: [],
                };

                await sendTriggerExecution(triggerExecutionReply);
            });
        });

        res.sendStatus(200);
    } catch (err) {
        console.error((err as Error).message);
        res.sendStatus(400);
    }
});

app.listen(3000, async () => {
    console.log("The application is listening on port 3000!");

    try {
        getMessagesAll10Minutes(processMessages);
    } catch (err) {
        console.error((err as Error).message);
    }
});
