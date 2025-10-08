import { createQueue, getQueueArn } from "./sqs.ts";
import { createLambdaRole } from "./iam.ts";


(async () => {
    try {
        const queueUrl = await createQueue("DistanceBufferQueue");
        const queueArn = await getQueueArn(queueUrl);

        const roleArn = await createLambdaRole("LambdaRole", queueArn);


        console.log("All resources created successfully!");
    } catch (err) {
        console.error("Error creating resources:", err);
    }
})();
