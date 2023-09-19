import boto3
import json

import pandas as pd
from tqdm import tqdm
from datetime import datetime
from time import sleep

# define all required variables
# ------------------------------

profile_name = 'osome' # your profile name 
job_name = 'handleNdResignationRequestAccepted' # handleUpdateTickets
queue_name = 'hermes-production-WorkerQueue' # '...-production-WorkerQueue'
input_file = 'data.csv' # file_name.csv

# ------------------------------

boto3.setup_default_session(profile_name=profile_name)
sqs = boto3.resource('sqs')
queue = sqs.get_queue_by_name(QueueName=queue_name)

def send_batch(batch):
    print('hi hi hi', batch)
    queue.send_messages(Entries=batch)


def main():
    df = pd.read_csv(input_file, sep=',')
    print(f'df length {len(df)}')
    print(df.columns)

    batch = []
    for index, row in tqdm(df.iterrows()):
        print(f'{datetime.now()} current {index}')
        # if len(batch) == 10:
        #     send_batch(batch)
        #     batch = []

        batch.append({
            'Id': str(index),
            'MessageBody': json.dumps({
                "newNdUserId": int(row['userId']),
                # "newNdUserId": 587825,
                "companyId": int(row['companyId']),
                "needToCreateNomineeDirectorNoticeTicket": True
            }),
            'MessageAttributes': {
                "TaskName": {
                    "DataType": "String",
                    "StringValue": job_name,
                }
            }
        })
        send_batch(batch)
        sleep(5 * 60)
        batch = []



    # if len(batch) > 0:
    #     send_batch(batch)

    # print('finish')
    # sleep(5 * 60)

if __name__ == '__main__':
    main()