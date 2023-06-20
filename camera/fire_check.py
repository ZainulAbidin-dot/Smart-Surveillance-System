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
import requests

import mysql.connector
from flask import jsonify, request

from consensus import Consensus

# Set up MySQL connection
# mydb = mysql.connector.connect(
#   host="bkonlfafuv6wihxzz8ow-mysql.services.clever-cloud.com",
#   user="u1hrj96dwl8e3xvx",
#   password="ZDbcCC6qR15FPRgAtGAe",
#   database="bkonlfafuv6wihxzz8ow",
#   port=3306
# )
# # Create a cursor to execute queries
# mycursor = mydb.cursor()

import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

room_no = os.getenv('ROOM_NO')
device_id = os.getenv('DEVICE_ID')

def create_notification():
    print("Notification Creating")

    # sql = "SELECT user_id, room_name, device_name FROM user_rooms WHERE device_id = %s"
    # val = (device_id,)
    # mycursor.execute(sql, val)
    # result = mycursor.fetchone()

    # if result:
    #     user_id = result[0]
    #     room_name = result[1]
    #     device_name = result[2]
    #     title = "Fire Detected !"
    #     body = "Fire was detected in Room '" + room_name + "' by device : " + device_name

    #     print(user_id, title, body)

    #     # Insert the room details into the 'room' table
    #     sql = "INSERT INTO notifications (user_id, title, body) VALUES (%s, %s, %s)"
    #     val = (user_id, title, body)
    #     mycursor.execute(sql, val)
    #     mydb.commit()

    # else:
    #     print("Device ID not found in user_rooms table")
    #     return
    
    
    print("Here PUSH NOtification")

    url = "https://app.nativenotify.com/api/notification"

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "appId": 8001,
        "appToken": "zy08cMaUkMdVRgRWjNB7bm",
        "title": "Fire Detected",
        "body": "Fire Detected in Room '" + room_no + "' by device : " + device_id,
        "dateSent": "5-16-2023 1:49PM",
        # "pushData": {"yourProperty": "yourPropertyValue"},
        "bigPictureURL": "https://images.pexels.com/photos/5213883/pexels-photo-5213883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200 | response.status_code == 201:
        print("POST request successful.")
    else:
        print("POST request failed with status code:", response.status_code)


    # Return success message
    response = {
        'status': 'success',
        'message': 'Notification created successfully!'
    }
    print(response)
    


###################################################################################################

c = Consensus()


fire_cascade = cv2.CascadeClassifier('fire_detection_cascade_model.xml') # To access xml file which includes positive and negative images of fire. (Trained images)
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

                print(timer)
                if timer >= 10 or runOnce == False:
                    final_result = Consensus.consensus_algo()
                    # final_result = "true"
                    if(final_result == "true"):
                         print("Notify")
                         create_notification()
                    print("Mail send initiated")
                    # threading.Thread(target=send_mail_function).start() # To call alarm thread
                    runOnce = True
                    # time.sleep(30)
                else:
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
            # print(timer)
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

app = Flask(__name__)
fd = FireDetection()

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



@app.route('/')
def index():
    return "Hello, Fire Detection!"

@app.route('/video')
def index2():
    final_result = Consensus.consensus_algo()
    if(final_result == "true"):
         print("Result is :",final_result)
    else:
         print("Result is :",final_result)
         
    return "Hello, Fire Detection!"

# @app.route('/video_feed/<string:ip_address>')
# def video_feed(ip_address):
#     return Response(fd.fire_detection(ip_address))

@app.route('/video_feed/<string:ip_address>')
def video_feed(ip_address):
    return Response(FireDetection.fire_detection(ip_address),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/video_feed2/<string:ip_address>')
# def video_feed2(ip_address):
#     return Response(FireDetection.fire_detection(ip_address),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/create_room', methods=['POST'])
def create_room():
    print("fdr")
    # Extract user_id, room_id, info, status from request body
    user_id = request.json.get('user_id')
    room_no = request.json.get('room_no')
    info = request.json.get('info')
    status = request.json.get('status')

    print(user_id, room_no, status, info)

    # Insert the room details into the 'room' table
    sql = "INSERT INTO room (user_id, room_no, info, status) VALUES (%s, %s, %s, %s)"
    val = (user_id, room_no, info, status)
    mycursor.execute(sql, val)
    mydb.commit()

    print("Here")

    # Return success message
    response = {
        'status': 'success',
        'message': 'Room created successfully!'
    }
    print(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)





