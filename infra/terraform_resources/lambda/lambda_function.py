import math
import boto3
import os

# Initialize SNS client
sns = boto3.client('sns')
SNS_TOPIC_ARN = os.environ.get("SNS_TOPIC_ARN")  # Set this in Lambda environment variables

#Got this piece of code from GoogleSearch
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

def lambda_handler(event, context):
    vehicle_lat = event.get("vehicle_lat")
    vehicle_lon = event.get("vehicle_lon")
    handheld_lat = event.get("handheld_lat")
    handheld_lon = event.get("handheld_lon")

    print(f"Vehicle: {vehicle_lat}, {vehicle_lon}")
    print(f"Handheld: {handheld_lat}, {handheld_lon}")

    distance = haversine_distance(vehicle_lat, vehicle_lon, handheld_lat, handheld_lon)

    if distance >= 50:
        message = f"ALERT: Devices are {round(distance, 2)} meters apart (>50m)."
    # Publish to SNS
        sns.publish(
                TopicArn=SNS_TOPIC_ARN,
                Message=message,
                Subject="Distance Alert: Vehicle vs Handheld"
            )
    else:
        message = f"Devices are {round(distance, 2)} meters apart (within safe range)."

    print(message)
    return {
        "body": message
    }
