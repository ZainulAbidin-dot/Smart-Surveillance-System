import cv2
import threading
from flask import Flask, render_template, Response

app = Flask(__name__)
video_captures = {}

def video_stream(ip_address):
    """Generator function to stream video from the given IP address."""
    global video_captures

    # Create a video capture object for the given IP address if it doesn't exist
    if ip_address not in video_captures:
        video_captures[ip_address] = cv2.VideoCapture(ip_address)

    while True:
        # Read a frame from the video capture object
        ret, frame = video_captures[ip_address].read()

        if not ret:
            # Release the video capture object if there are no more frames
            video_captures[ip_address].release()
            del video_captures[ip_address]
            break

        # Convert the frame to JPEG format
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        # Yield the frame as a byte string
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/index')
def index():
    """Render the index page."""
    return render_template('index.html')

@app.route('/video_feed/<ip_address>')
def video_feed(ip_address):
    """Stream video from the given IP address."""   
    return Response(video_stream(ip_address),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
