import express from 'express';
import dotenv from 'dotenv';
import { getMessagesAll10Minutes, processMessages } from './cloudgatewayApi';
import { IMessageResponse } from './types/message';

dotenv.config({ path: '.env' });

const app = express();

app.get('/notify', async (req, res) => {
    const messageResponse = await fetch(`${process.env.KALYPSO_CLOUD_GATEWAY_URL}/api/messages`, {
        method: 'GET',
        headers: {
            'X-API-Key': process.env.KALYPSO_API_KEY!,
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

app.listen(3000, async () => {
    console.log('The application is listening on port 3000!');

    try {
        getMessagesAll10Minutes(processMessages);
    } catch (err) {
        console.error((err as Error).message);
    }
});
