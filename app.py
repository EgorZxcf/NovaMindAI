import os
import base64
import requests

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse

app = FastAPI()

@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/style.css")
def style():
    return FileResponse("style.css")

@app.get("/script.js")
def script():
    return FileResponse("script.js")

@app.post("/upload_image")
async def upload_image(
    image: UploadFile = File(...)
):

    content = await image.read()

    encoded = base64.b64encode(
        content
    ).decode()

    return {
        "image": encoded
    }
