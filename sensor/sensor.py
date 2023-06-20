import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

room_no = os.getenv('ROOM_NO')
timer = 0

from consensus import Consensus

import serial
from time import sleep

Arduino = serial.Serial('COM3',9600)
c = Consensus()

while True:
    if (Arduino.inWaiting() > 0):
        myData = Arduino.readline()
        # print(myData)
        if(myData == b'0\r\n'):
            print(room_no)
            if(timer == 10):
                print("Send Signal")
                Consensus.consensus_algo()
                # sleep(10)
                timer = 0
            else:
                timer = timer + 1