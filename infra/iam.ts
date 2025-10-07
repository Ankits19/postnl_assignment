import { IAMClient, CreateRoleCommand, AttachRolePolicyCommand } from "@aws-sdk/client-iam";

const iamClient = new IAMClient({ region: "us-east-1" });

export async function createLambdaRole(roleName: string): Promise<string> {
    const assumeRolePolicy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: { Service: "lambda.amazonaws.com" },
            Action: "sts:AssumeRole"
        }]
    });

    const roleResponse = await iamClient.send(new CreateRoleCommand({
        RoleName: roleName,
        AssumeRolePolicyDocument: assumeRolePolicy
    }));

    await iamClient.send(new AttachRolePolicyCommand({
        RoleName: roleName,
        PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    }));

    await iamClient.send(new AttachRolePolicyCommand({
        RoleName: roleName,
        PolicyArn: "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
    }));

    console.log("Waiting for IAM role propagation...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    return roleResponse.Role?.Arn!;
}
