import { createQueue, getQueueArn } from "./sqs.ts";

(async () => {
    try {
        const queueUrl = await createQueue("DistanceBufferQueue");
        const queueArn = await getQueueArn(queueUrl);

        console.log("All resources created successfully!");
    } catch (err) {
        console.error("Error creating resources:", err);
    }
})();
