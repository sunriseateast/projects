import boto3
import time
import string
import os
from pprint import pprint
volume=[]
N=1
def lambda_handler(event, context):
    if os.path.exists("/tmp/counter.txt"):   ### create file in /tmp folder of lambda to set counter as res to name the created volume as aplhabetical order
        f=open("/tmp/counter.txt","r")
        read=f.readlines()
        inc=read[-1]
        inc=int(inc)+1
        f=open("/tmp/counter.txt","a")
        f.write(str(inc)+"\n")
        f.close()
    else:
        f=open("/tmp/counter.txt","a")
        f.write(str(105)+"\n")
        f.close()
    f=open("/tmp/counter.txt","r")
    read=f.readlines()
    alpha=int(read[-1])
    res=(chr(alpha))
    
    
    ec2_console=boto3.client("ec2")
    ec2_console.create_volume(AvailabilityZone='ap-south-1b',Size=10, VolumeType='gp3') ###create volume
    
    ebs_console=ec2_console.describe_volumes() ### adding volume to list by using describe method
    for i in ebs_console['Volumes']:
        volume.append(i['VolumeId'])
    time.sleep(5)
    ec2_console.attach_volume(      ### Attach volume to ec2 instance
        Device='xvd'+str(res),
        InstanceId='i-0a6285983294e3fb7',
        VolumeId=volume[-1]
    )