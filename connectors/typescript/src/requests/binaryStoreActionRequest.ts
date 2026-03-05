import { downloadTextBinary, sendMessageReply, uploadTextBinary } from "../cloudgatewayApi";
import { IActionReplyBase } from "../types/actionTypes";
import { IActionMessage } from "../types/messageTypes";

export const BINARY_ROUNDTRIP_ACTION_NAME = "BinaryStoreRoundtrip";

export const processBinaryStoreActionRequest = async (
    msg: IActionMessage,
    actionResponse: IActionReplyBase
): Promise<void> => {
    const payload = (msg.payload ?? {}) as { Content?: string; FileName?: string };
    const content = payload.Content ?? "Hallo aus dem Binary-Store-Beispiel.";
    const fileName = payload.FileName ?? "beispiel.txt";

    const upload = await uploadTextBinary(msg.tenantId, fileName, content);
    const downloadedContent = await downloadTextBinary(upload.downloadPermitToken);

    await sendMessageReply({
        ...actionResponse,
        type: "ActionReply",
        payload: {
            BinaryId: upload.binaryId,
            DownloadPermitToken: upload.downloadPermitToken,
            ContentMatches: downloadedContent === content,
        },
        binaryIds: [upload.binaryId],
    });
};
