import websocket
import cv2
import numpy as np

def on_message(ws, message):
    # convert message bytes to numpy array
    frame_bytes = np.frombuffer(message, dtype=np.uint8)

    # decode image from bytes
    frame = cv2.imdecode(frame_bytes, cv2.IMREAD_COLOR)

    # show image
    cv2.imshow("Video Feed", frame)
    cv2.waitKey(1)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("Connection closed")

def on_open(ws):
    print("Connected to video feed")

if __name__ == "__main__":
    # create websocket connection
    ws = websocket.WebSocketApp("ws://localhost:8000/video_feed",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open

    # start listening to websocket
    ws.run_forever()

