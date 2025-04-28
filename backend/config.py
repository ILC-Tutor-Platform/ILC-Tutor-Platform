import boto3
import json
from botocore.exceptions import ClientError

_secret_cache = None 

def get_secret():
    global _secret_cache
    if _secret_cache is not None:
        return _secret_cache

    secret_name = "dev/arallink/credentials"
    region_name = "ap-southeast-1"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        secret = get_secret_value_response['SecretString']
        _secret_cache = json.loads(secret) 
        return _secret_cache
    except ClientError as e:
        raise e

