import base64
import datetime
import time
import cv2
import numpy as np
from flask import Flask, Response, render_template
import threading   # Library for threading -- which allows code to run in backend
import playsound   # Library for alarm sound
import smtplib     # Library for email sending
import ssl
from email.mime.text import MIMEText
from email.utils import formataddr
from email.mime.multipart import MIMEMultipart  # New line
from email.mime.base import MIMEBase  # New line
from email import encoders  # New line

from typing import AsyncGenerator, Dict
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, Response, Request
from fastapi.responses import StreamingResponse, HTMLResponse,JSONResponse
from fastapi.templating import Jinja2Templates


import mysql.connector
from flask import jsonify, request

# from consensus import Consensus


from typing import Union

from fastapi import FastAPI



# c = Consensus()


fire_cascade = cv2.CascadeClassifier('../fire_detection_cascade_model.xml') # To access xml file which includes positive and negative images of fire. (Trained images)
# File is also provided with the code.


class FireDetection:
    def fire_detection(ip_address):
        # Load a sample video or webcam

        if ip_address == '0':
            ip_address = 0
            print(ip_address)

        else:
            print(ip_address)
            ip_address = ip_address.replace("-", ":")
            ip_address = ip_address.replace("+", "/")
            ip_address = 'http://' + ip_address
            print(ip_address)

        vid = cv2.VideoCapture(ip_address) # To start camera this command is used "0" for laptop inbuilt camera and "1" for USB attahed camera
        runOnce = False # created boolean    		
        timer = 0
        fps = vid.get(cv2.CAP_PROP_FPS)  # Get the FPS of the video

        # Define the codec and create VideoWriter object
        fourcc = cv2.VideoWriter_fourcc(*'MJPG')
        out = None

        while(True):
            Alarm_Status = False
            ret, frame = vid.read() # Value in ret is True # To read video frame
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # To convert frame into gray color
            fire = fire_cascade.detectMultiScale(frame, 1.2, 5) # to provide frame resolution

            ## to highlight fire with square 
            for (x,y,w,h) in fire:
                cv2.rectangle(frame,(x-20,y-20),(x+w+20,y+h+20),(255,0,0),2)
                roi_gray = gray[y:y+h, x:x+w]
                roi_color = frame[y:y+h, x:x+w]

                print("Fire alarm initiated")
                # threading.Thread(target=play_alarm_sound_function).start()  # To call alarm thread

                if runOnce == False:
                    # final_result = c.consensus_algo()
                    # print("Mail send initiated", final_result)
                    # threading.Thread(target=send_mail_function).start() # To call alarm thread
                    runOnce = True
                    # time.sleep(30)
                if runOnce == True:
                    print("Mail is already sent once")
                    runOnce = True

            # Yield the frame to Flask
            ret, jpeg = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

            cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            # Write video file after every 5 minutes
            timer += 1/fps
            print(timer)
            if timer >= 300:  # 5 minutes
                print("Time UP")
                if out is not None:
                    out.release()
                filename = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S.avi")
                out = cv2.VideoWriter(filename, fourcc, fps, (int(vid.get(cv2.CAP_PROP_FRAME_WIDTH)), int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))))
                timer = 0
            if out is not None:
                out.write(frame)

        if out is not None:
            out.release()
        vid.release()
        cv2.destroyAllWindows()


def play_alarm_sound_function(): # defined function to play alarm post fire detection using threading
    playsound.playsound('fire_alarm.mp3',True) # to play alarm # mp3 audio file is also provided with the code.
    print("Fire alarm end") # to print in consol

def send_mail_function(): # defined function to send mail post fire detection using threading
    # User configuration
    sender_email = 'zx996666@gmail.com'
    sender_name = 'Zack Xavier'
    password = 'uunwmblfodgisnba'

    receiver_emails = ['k191084@nu.edu.pk', 'tomsawyer925@gmail.com']
    receiver_names = ['Abdul Rehman', 'Tom Sawyer']

    # Email body
    email_html = open('email.html')
    email_body = email_html.read()

    filename = 'opencv_frame_0.png'

    for receiver_email, receiver_name in zip(receiver_emails, receiver_names):
            print("Sending the email...")
            # Configurating user's info
            msg = MIMEMultipart()
            msg['To'] = formataddr((receiver_name, receiver_email))
            msg['From'] = formataddr((sender_name, sender_email))
            msg['Subject'] = 'Fire detected in Building-402 in NorthWest Virginia'

            msg.attach(MIMEText(email_body, 'html'))

            try:
                # Open PDF file in binary mode
                with open(filename, "rb") as attachment:
                                part = MIMEBase("application", "octet-stream")
                                part.set_payload(attachment.read())

                # Encode file in ASCII characters to send by email
                encoders.encode_base64(part)

                # Add header as key/value pair to attachment part
                part.add_header(
                        "Content-Disposition",
                        f"attachment; filename= {filename}",
                )

                msg.attach(part)
            except Exception as e:
                    print('Oh no! We didnt found the attachment!n')
                    break

            try:
                    # Creating a SMTP session | use 587 with TLS, 465 SSL and 25
                    server = smtplib.SMTP('smtp.gmail.com', 587)
                    # Encrypts the email
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                    # We log in into our Google account
                    server.login(sender_email, password)
                    # Sending email from sender, to receiver with the email body
                    server.sendmail(sender_email, receiver_email, msg.as_string())
                    print('Email sent!')
            except Exception as e:
                    print('Oh no! Something bad happened!n')
                    break
            finally:
                    print('Closing the server...')
                    server.quit()


def start_fire_detection(self, ip_address):
    threading.Thread(target=self.fire_detection, args=[ip_address]).start()


app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}

import threading
from fastapi import FastAPI
from fastapi.responses import StreamingResponse


def fire_detection(video_path):
    FireDetection.fire_detection(video_path)
    # Your implementation of the fire_detection function
    pass

@app.get("/video_feed/{video_path}")
async def video_feed(video_path):
    # Create a new thread for each video feed
    t = threading.Thread(target=fire_detection, args=(video_path,))
    t.start()

    # Return a response immediately
    async def stream():
        for frame in FireDetection.fire_detection(video_path):
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return StreamingResponse(stream(), media_type="multipart/x-mixed-replace; boundary=frame")

# @app.get("/video_feed")
# async def video_feed():
#     return threading.Thread(
#      StreamingResponse(FireDetection.fire_detection("0"), media_type="multipart/x-mixed-replace; boundary=frame")
#     )

@app.get("/video_feed2")
async def video_feed():
    return StreamingResponse(FireDetection.fire_detection("0"), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}