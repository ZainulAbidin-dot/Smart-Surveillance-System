import asyncio
import cv2
import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse, HTMLResponse,JSONResponse, FileResponse


app = FastAPI()

cap = cv2.VideoCapture(0)

async def stream_video(websocket: WebSocket):
    while True:
        # read frame from the video
        ret, frame = cap.read()

        # check if there's a frame, otherwise break
        if not ret:
            break

        # convert frame to bytes
        frame_bytes = cv2.imencode(".jpg", frame)[1].tobytes()

        # send frame to the client via websocket
        await websocket.send_bytes(frame_bytes)

        # wait for a short time to avoid overwhelming the client
        await asyncio.sleep(0.03)

@app.get("/")
async def root():
    return FileResponse("./index.html")

@app.websocket("/video_feed")
async def video_feed(websocket: WebSocket):
    await websocket.accept()

    # start the video stream in a separate task
    asyncio.create_task(stream_video(websocket))
