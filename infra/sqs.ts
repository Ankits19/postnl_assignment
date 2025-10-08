import { SQSClient, CreateQueueCommand, GetQueueAttributesCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "us-east-1" });

export async function createQueue(queueName: string): Promise<string> {
    const command = new CreateQueueCommand({
        QueueName: queueName,
        Attributes: { 
            DelaySeconds: "0", 
            MessageRetentionPeriod: "86400" 
        }
    });
    const response = await sqsClient.send(command);
    console.log("Queue created:", response.QueueUrl);
    return response.QueueUrl!;
}

export async function getQueueArn(queueUrl: string): Promise<string> {
    const command = new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["QueueArn"]
    });
    const response = await sqsClient.send(command);
    if (!response.Attributes?.["QueueArn"]) throw new Error("QueueArn not found");
    return response.Attributes["QueueArn"];
}
