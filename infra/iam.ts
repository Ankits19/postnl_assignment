import { IAMClient, CreateRoleCommand, PutRolePolicyCommand } from "@aws-sdk/client-iam";

const iamClient = new IAMClient({ region: "us-east-1" });

export async function createLambdaRole(roleName: string, queueArn: string): Promise<string> {
    // Trust policy: Lambda service can assume this role
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

    const inlinePolicy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "sqs:SendMessage"
                ],
                Resource: queueArn
            },
            {
                Effect: "Allow",
                Action: [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                Resource: "*"
            },
            {
                Effect: "Allow",
                Action: [
                    "sns:Publish"
                ],
                Resource: "*"
            }
        ]
    });

    // Attach the inline policy
    await iamClient.send(new PutRolePolicyCommand({
        RoleName: roleName,
        PolicyName: `${roleName}-SQSSendLogsPolicy`,
        PolicyDocument: inlinePolicy
    }));

    console.log("IAM role created for Lambda with SQS send + CloudWatch logs.");
    return roleResponse.Role?.Arn!;
}